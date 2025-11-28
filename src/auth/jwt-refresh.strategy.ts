import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.['refresh_token'];
            }]),
            ignoreExpiration: false,
            // Use a dedicated refresh secret if provided
            secretOrKey: config.get<string>('jwtRefreshSecret') || config.get<string>('jwtSecret') || 'changeme',
        });
    }

    async validate(payload: any) {
        // Return full payload so controller can access `rid` (refresh id)
        return payload;
    }
}
