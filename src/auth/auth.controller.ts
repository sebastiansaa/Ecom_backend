import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('login')
  @Throttle(5, 60)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new Error('Unauthorized');
    const tokens = await this.authService.loginFlow(user, body['device']);

    const cookieOptions = {
      httpOnly: true,
      sameSite: this.config.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    } as any;

    res.cookie('refresh_token', tokens.refresh_token, cookieOptions);
    return { access_token: tokens.access_token };
  }

  @Post('register')
  @Throttle(2, 60)
  async register(
    @Body() body: { email: string; password: string; name?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(body);
    const tokens = await this.authService.loginFlow(user);
    const cookieOptions = {
      httpOnly: true,
      sameSite: this.config.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as any;
    res.cookie('refresh_token', tokens.refresh_token, cookieOptions);
    return { access_token: tokens.access_token };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Throttle(10, 60)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // JwtRefreshStrategy validates token and puts payload in req.user (payload includes rid)
    const payload = (req as any).user;
    const oldRefresh = (req as any).cookies?.['refresh_token'];
    if (!oldRefresh) throw new Error('No refresh token');
    const rid = payload.rid as string;
    const userId = payload.sub as string;
    const tokens = await this.authService.rotateRefreshToken(userId, rid, oldRefresh);
    const cookieOptions = {
      httpOnly: true,
      sameSite: this.config.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    } as any;
    res.cookie('refresh_token', tokens.refresh_token, cookieOptions);
    return { access_token: tokens.access_token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = (req as any).user;
    // revoke all refresh tokens for this user
    await this.authService.revokeAllTokens(user.id);
    res.clearCookie('refresh_token', { path: '/' });
    return { ok: true };
  }
}
