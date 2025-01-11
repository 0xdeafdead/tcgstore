import { OmitType } from '@nestjs/swagger';
import { CreateRoleDTO } from './createRole.dto';

export class UpdateRoleDTO extends OmitType(CreateRoleDTO, [
  'permissionIds',
] as const) {}
