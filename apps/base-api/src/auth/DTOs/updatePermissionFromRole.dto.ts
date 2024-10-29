import { RoleName } from '@prisma/client';

export class UpdatePermissionFromRoleDTO {
  role: RoleName;
  permissionsToAdd: string[];
  permissionsToRemove: string[];
}
