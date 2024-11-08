import { Test, TestingModule } from '@nestjs/testing';
import { JWTService } from './jwt.service';
import { JWT_MODULE_CONFIG } from './jwt.constants';

describe('JWTService', () => {
  let service: JWTService;

  const mockConfig = {
    secret: 'fakeSecretKey',
    issuer: 'fakeIssuer',
    audience: ['fakeAudience'],
  };

  beforeEach(async () => {
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
});
