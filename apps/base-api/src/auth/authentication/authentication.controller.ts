import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDTO } from '../DTOs/signUp.dto';
import { Observable } from 'rxjs';
import { SignInDTO } from '../DTOs/sigIn.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  @Post('/signUp')
  signUp(@Body() input: SignUpDTO): Observable<string> {
    return this.service.signUp(input);
  }

  @Post('/signIn')
  signIn(@Body() input: SignInDTO): Observable<string> {
    return this.service.signIn(input);
  }
}
