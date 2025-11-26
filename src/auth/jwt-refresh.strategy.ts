import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.['refresh_token'];
            }]),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('jwtSecret') || 'changeme',
        });
    }

    async validate(payload: any) {
        // Return full payload so controller can access `rid` (refresh id)
        return payload;
    }
}
