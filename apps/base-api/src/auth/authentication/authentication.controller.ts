import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { signUpDTO } from '../DTOs/signUp.dto';
import { Observable } from 'rxjs';
import { signInDTO } from '../DTOs/sigIn.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly service: AuthenticationService) {}

  @Post('/signUp')
  signUp(@Body() input: signUpDTO): Observable<string> {
    return this.service.signUp(input);
  }

  @Post('/signIn')
  signIn(@Body() input: signInDTO): Observable<string> {
    return this.service.signIn(input);
  }
}
