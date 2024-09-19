import { RoleName } from '@prisma/client';

export function getRoleId(role: RoleName) {
  switch (role) {
    case RoleName.DEV:
      return process.env.DEV_ROLE_ID;
    case RoleName.ADMIN:
      return process.env.ADMIN_ROLE_ID;
    default:
      return process.env.USER_ROLE_ID;
  }
}
