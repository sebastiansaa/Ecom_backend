import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;
    // @ts-ignore
    delete user.password;
    return user;
  }

  async getTokens(userId: string, email: string) {
    // Note: caller should provide `rid` for refresh token identification when needed
    const accessToken = await this.jwtService.signAsync({ sub: userId, email }, { expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES_IN') || '1h' });
    // refresh token creation is handled by caller so it can include `rid` claim
    return { access_token: accessToken };
  }

  private async signRefreshToken(payload: Record<string, any>, rid: string) {
    // include rid in refresh token payload and sign with refresh-specific secret when available
    const refreshSecret = this.config.get<string>('jwtRefreshSecret') || this.config.get<string>('jwtSecret');
    return this.jwtService.signAsync(
      { ...payload, rid },
      { expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN') || '7d', secret: refreshSecret },
    );
  }

  private async createRefreshTokenEntry(userId: string, rid: string, refreshToken: string, device?: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const expiresDays = 7;
    const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);
    return this.prisma.refreshToken.create({ data: { id: rid, tokenHash: hash, userId, expiresAt, device } });
  }

  async removeRefreshTokenById(userId: string, rid: string) {
    await this.prisma.refreshToken.updateMany({ where: { id: rid, userId }, data: { revoked: true } });
  }

  async revokeAllTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({ where: { userId }, data: { revoked: true } });
  }

  async rotateRefreshToken(userId: string, rid: string, oldRefreshToken: string) {
    const tokenRow = await this.prisma.refreshToken.findUnique({ where: { id: rid } });
    if (!tokenRow || tokenRow.revoked) {
      // possible reuse or token missing -> revoke all sessions for user
      await this.revokeAllTokens(userId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    const valid = await bcrypt.compare(oldRefreshToken, tokenRow.tokenHash);
    if (!valid) {
      // token mismatch -> possible reuse
      await this.revokeAllTokens(userId);
      throw new UnauthorizedException('Refresh token reuse detected');
    }

    // rotate: revoke old token and create new one
    await this.prisma.refreshToken.update({ where: { id: rid }, data: { revoked: true } });
    const newRid = require('uuid').v4();
    const userRec = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userRec) {
      await this.revokeAllTokens(userId);
      throw new UnauthorizedException('User not found');
    }
    const newRefresh = await this.signRefreshToken({ sub: userId, email: userRec.email }, newRid);
    await this.createRefreshTokenEntry(userId, newRid, newRefresh);
    const access = (await this.getTokens(userId, userRec.email)).access_token;
    return { access_token: access, refresh_token: newRefresh };
  }

  async loginFlow(user: any, device?: string) {
    const rid = require('uuid').v4();
    const access = (await this.getTokens(user.id, user.email)).access_token;
    const refresh = await this.signRefreshToken({ sub: user.id, email: user.email }, rid);
    await this.createRefreshTokenEntry(user.id, rid, refresh, device);
    return { access_token: access, refresh_token: refresh, rid };
  }

  async register(data: { email: string; password: string; name?: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({ data: { ...data, password: hashed } });
    // @ts-ignore
    delete user.password;
    return user;
  }
}
