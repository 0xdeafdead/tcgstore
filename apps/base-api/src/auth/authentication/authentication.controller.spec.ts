import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SignUpDTO } from '../DTOs/signUp.dto';
import { of } from 'rxjs';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  const mockService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should return token when sign up', (done) => {
      const input: SignUpDTO = {
        email: 'email',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
      };
      mockService.signUp.mockReturnValueOnce(of('token'));
      controller.signUp(input).subscribe({
        next: (res) => {
          expect(res).toMatch('token');
          done();
        },
      });
    });
  });

  describe('signIn', () => {
    it('should return token when sign in', (done) => {
      const input = {
        email: 'email',
        password: 'password',
      };
      mockService.signIn.mockReturnValueOnce(of('token'));
      controller.signIn(input).subscribe({
        next: (res) => {
          expect(res).toMatch('token');
          done();
        },
      });
    });
  });
});
