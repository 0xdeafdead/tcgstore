import { OmitType } from '@nestjs/swagger';
import { CreateUserDTO } from './createUser.dto';

export class UpdateUserDTO extends OmitType(CreateUserDTO, [
  'roleId',
  'email',
] as const) {}
