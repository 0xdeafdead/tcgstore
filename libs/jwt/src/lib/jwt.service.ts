import { Inject, Injectable } from '@nestjs/common';
import { createSecretKey, KeyObject } from 'crypto';
import { JWTModuleConfig } from './jwt.types';
import { JWT_MODULE_CONFIG } from './jwt.constants';
import { JWTPayload, jwtVerify, JWTVerifyOptions, SignJWT } from 'jose';
import dayjs = require('dayjs');

export interface generateTokenParams {
  issuer: string;
  audience: string;
  issuedAt?: Date;
  expiresAt?: Date;
  notBefore?: Date;
}

export class JWTService {
  private readonly secret: KeyObject;

  constructor(
    @Inject(JWT_MODULE_CONFIG)
    private readonly options: JWTModuleConfig
  ) {
    this.secret = createSecretKey(options.secret, 'utf-8');
  }

  async generateToken(
    payload: Record<string, unknown>,
    params: generateTokenParams
  ): Promise<string> {
    const now = dayjs();
    const issuedAt = now.toDate();
    const expiresAt = now.add(24, 'hour').toDate();
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuer(params.issuer)
      .setAudience(params.audience)
      .setIssuedAt(params.issuedAt || issuedAt)
      .setNotBefore(params.notBefore || params.issuedAt || issuedAt)
      .setExpirationTime(params.expiresAt || expiresAt)
      .sign(this.secret);
  }

  async verifyToken(
    token: string,
    options?: JWTVerifyOptions
  ): Promise<JWTPayload | null> {
    try {
      const { payload, protectedHeader } = await jwtVerify(
        token,
        this.secret,
        options
      );
      console.log('payload', payload);
      console.log('protectedHeader', protectedHeader);
      return payload;
    } catch (err) {
      console.log('err', err);
      console.error(`Token is invalid. Error:${err}`);
      return null;
    }
  }
}
