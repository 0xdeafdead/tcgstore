import { Body, Controller, Put } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { UpdateUserRoleDTO } from '../DTOs/updateUserRole.dto';
import { Observable } from 'rxjs';
import { UserRole } from '@prisma/client';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly service: AuthorizationService) {}

  @Put()
  updateUserRole(@Body() input: UpdateUserRoleDTO): Promise<UserRole> {
    return this.service.assignRoleToUser(input);
  }
}
