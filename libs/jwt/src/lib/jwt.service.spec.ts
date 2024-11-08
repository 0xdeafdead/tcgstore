import { Test, TestingModule } from '@nestjs/testing';
import { GenerateTokenParams, JWTService } from './jwt.service';
import { JWT_MODULE_CONFIG } from './jwt.constants';
import dayjs = require('dayjs');
import MockDate from 'mockdate';
import * as jose from 'jose';
import { UnauthorizedException } from '@nestjs/common';
import { createSecretKey } from 'crypto';

describe('JWTService', () => {
  let service: JWTService;
  const date = new Date();
  const mockConfig = {
    secret: 'fakeSecret',
    issuer: 'fakeIssuer',
    audience: ['fakeAudience'],
  };

  afterEach(() => {
    MockDate.reset();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    MockDate.set(date);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTService,
        {
          provide: JWT_MODULE_CONFIG,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<JWTService>(JWTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    const payload: Record<string, unknown> = {
      sub: 'fakeUser',
      permissions: ['fakePermission'],
    };
    //one day after date cons
    const now = dayjs().add(1, 'day');
    const expire = now.add(24, 'hour').toDate();
    const params: GenerateTokenParams = {
      issuer: 'fakeIssuer2',
      audience: ['fakeAudience2'],
      issuedAt: now.toDate(),
      expiresAt: expire,
      notBefore: now.toDate(),
    };

    const newJwt = new jose.SignJWT(payload);
    const spysign = jest.spyOn(jose, 'SignJWT');
    beforeEach(() => {
      spysign.mockClear();
    });
    it('should return a token with payload', (done) => {
      spysign.mockReturnValueOnce(newJwt);
      const spyProtectedHeader = jest.spyOn(newJwt, 'setProtectedHeader');
      const spyIssuer = jest.spyOn(newJwt, 'setIssuer');
      const spyAudience = jest.spyOn(newJwt, 'setAudience');
      const spyIssuedAt = jest.spyOn(newJwt, 'setIssuedAt');
      const spyNotBefore = jest.spyOn(newJwt, 'setNotBefore');
      const spyExpirationTime = jest.spyOn(newJwt, 'setExpirationTime');
      const now = dayjs();
      const issuedAt = now.toDate();
      const expiresAt = now.add(24, 'hour').toDate();

      service.generateToken(payload).then((token) => {
        expect(spysign).toHaveBeenCalledWith(payload);
        expect(spyProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
        expect(spyIssuer).toHaveBeenCalledWith(mockConfig.issuer);
        expect(spyAudience).toHaveBeenCalledWith(mockConfig.audience);
        expect(spyIssuedAt).toHaveBeenCalledWith(issuedAt);
        expect(spyNotBefore).toHaveBeenCalledWith(issuedAt);
        expect(spyExpirationTime).toHaveBeenCalledWith(expiresAt);
        expect(token).toBeDefined();
        done();
      });
    });

    it('should return a token with payload and params', (done) => {
      spysign.mockReturnValueOnce(newJwt);
      const spyProtectedHeader = jest.spyOn(newJwt, 'setProtectedHeader');
      const spyIssuer = jest.spyOn(newJwt, 'setIssuer');
      const spyAudience = jest.spyOn(newJwt, 'setAudience');
      const spyIssuedAt = jest.spyOn(newJwt, 'setIssuedAt');
      const spyNotBefore = jest.spyOn(newJwt, 'setNotBefore');
      const spyExpirationTime = jest.spyOn(newJwt, 'setExpirationTime');
      const now = dayjs();

      service.generateToken(payload, params).then((token) => {
        expect(spysign).toHaveBeenCalledWith(payload);
        expect(spyProtectedHeader).toHaveBeenCalledWith({ alg: 'HS256' });
        expect(spyIssuer).toHaveBeenCalledWith(params.issuer);
        expect(spyAudience).toHaveBeenCalledWith(params.audience);
        expect(spyIssuedAt).toHaveBeenCalledWith(params.issuedAt);
        expect(spyNotBefore).toHaveBeenCalledWith(params.notBefore);
        expect(spyExpirationTime).toHaveBeenCalledWith(params.expiresAt);
        expect(token).toBeDefined();
        done();
      });
    });

    it('should return an error if unable to create a token', (done) => {
      const spySign = jest.spyOn(jose, 'SignJWT').mockImplementationOnce(() => {
        throw new Error('Unable to generate token');
      });
      service.generateToken(payload, params).catch((err) => {
        expect(spySign).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Unable to generate token');
        done();
      });
    });
  });

  describe('verifyToken', () => {
    const token = 'fakeToken';
    const options: jose.JWTVerifyOptions = {};

    it('should return UnatorizedException if token is expired', (done) => {
      const spysign = jest
        .spyOn(jose, 'jwtVerify')
        .mockRejectedValueOnce(new Error('Failed to verify token'));
      service.verifyToken(token, options).catch((err) => {
        expect(spysign).toHaveBeenCalledTimes(1);
        expect(spysign).toHaveBeenCalledWith(
          token,
          createSecretKey('fakeSecretKey', 'utf-8'),
          options
        );
        expect(err).toBeInstanceOf(UnauthorizedException);
        done();
      });
    });

    it('should return UnatorizedException if token is expired', (done) => {
      const spysign = jest
        .spyOn(jose, 'jwtVerify')
        .mockRejectedValueOnce({ code: 'ERR_JWT_EXPIRED' } as unknown as Error);
      service.verifyToken(token, options).catch((err) => {
        expect(spysign).toHaveBeenCalledTimes(1);
        expect(spysign).toHaveBeenCalledWith(
          token,
          createSecretKey('fakeSecretKey', 'utf-8'),
          options
        );
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Token is expired');
        done();
      });
    });

    it('should return UnatorizedException if token is expired', (done) => {
      const payload = {
        sub: 'fakeUser',
        permissions: ['fakePermission'],
      };
      const spysign = jest.spyOn(jose, 'jwtVerify').mockResolvedValueOnce({
        payload,
      } as any);
      service.verifyToken(token, options).then((res) => {
        expect(spysign).toHaveBeenCalledTimes(1);
        expect(spysign).toHaveBeenCalledWith(
          token,
          createSecretKey('fakeSecretKey', 'utf-8'),
          options
        );
        expect(res).toMatchObject(payload);
        done();
      });
    });
  });
});
