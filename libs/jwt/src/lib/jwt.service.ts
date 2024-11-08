import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { createSecretKey, KeyObject } from 'crypto';
import { JWTModuleConfig } from './jwt.types';
import { JWT_MODULE_CONFIG } from './jwt.constants';
import { JWTPayload, jwtVerify, JWTVerifyOptions, SignJWT } from 'jose';
import dayjs = require('dayjs');

export interface GenerateTokenParams {
  issuer: string;
  audience: string[];
  issuedAt?: Date;
  expiresAt?: Date;
  notBefore?: Date;
}

@Injectable()
export class JWTService {
  private readonly secret: KeyObject;
  private readonly issuer: string;
  private readonly audience: string[];
  private readonly logger = new Logger('AuthenticationService');

  constructor(
    @Inject(JWT_MODULE_CONFIG)
    private readonly options: JWTModuleConfig
  ) {
    this.secret = createSecretKey(options.secret, 'utf-8');
    this.issuer = options.issuer;
    this.audience = options.audience;
  }

  async generateToken(
    payload: Record<string, unknown>,
    params?: GenerateTokenParams
  ): Promise<string> {
    const now = dayjs();
    const issuedAt = now.toDate();
    const expiresAt = now.add(24, 'hour').toDate();
    try {
      return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer(params?.issuer ?? this.issuer)
        .setAudience(params?.audience ?? this.audience)
        .setIssuedAt(params?.issuedAt ?? issuedAt)
        .setNotBefore(params?.notBefore ?? params?.issuedAt ?? issuedAt)
        .setExpirationTime(params?.expiresAt ?? expiresAt)
        .sign(this.secret);
    } catch (err: any) {
      const errMsg = 'Unable to generate token';
      this.logger.error(errMsg + ' Error: ' + err.message);
      throw new InternalServerErrorException(errMsg);
    }
  }

  async verifyToken(
    token: string,
    options?: JWTVerifyOptions
  ): Promise<JWTPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret, options);
      return payload;
    } catch (err: any) {
      if (err.code === 'ERR_JWT_EXPIRED') {
        throw new UnauthorizedException('Token is expired');
      }
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
