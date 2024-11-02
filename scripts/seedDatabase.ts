// seeds/roles.seed.ts
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient, RoleName } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  const devRoleId = uuidv4();
  const adminRoleId = uuidv4();
  const userRoleId = uuidv4();

  const permissions = [
    { id: uuidv4(), name: 'read:role' },
    { id: uuidv4(), name: 'create:role' },
    { id: uuidv4(), name: 'update:role' },
    { id: uuidv4(), name: 'remove:role' },
    { id: uuidv4(), name: 'read:permission' },
    { id: uuidv4(), name: 'create:permission' },
    { id: uuidv4(), name: 'update:permission' },
    { id: uuidv4(), name: 'remove:permission' },
    { id: uuidv4(), name: 'read:user' },
    { id: uuidv4(), name: 'create:user' },
    { id: uuidv4(), name: 'update:user' },
    { id: uuidv4(), name: 'remove:user' },
    { id: uuidv4(), name: 'read:entity' },
    { id: uuidv4(), name: 'create:entity' },
    { id: uuidv4(), name: 'update:entity' },
    { id: uuidv4(), name: 'remove:entity' },
  ];

  const devPermissions = permissions;
  const adminPermissions = permissions.filter(
    (permission) =>
      !permission.name.startsWith('update:user') &&
      !permission.name.startsWith('read:user')
  );
  const userPermissions = permissions.filter(
    (permission) =>
      permission.name.startsWith('read:') ||
      permission.name.startsWith('update:userr')
  );

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: {},
      create: permission,
    });
  }

  const roles = [
    {
      id: userRoleId,
      name: 'User',
      role: RoleName.USER,
      permissions: userPermissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
    {
      id: adminRoleId,
      name: 'Admin',
      role: RoleName.ADMIN,
      permissions: adminPermissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
    {
      id: devRoleId,
      name: 'Dev',
      role: RoleName.DEV,
      permissions: permissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role: role.role },
      update: {},
      create: {
        ...role,
        permissions: {
          createMany: { data: role.permissions, skipDuplicates: true },
        },
      },
    });
  }

  console.log('Roles and permissions seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
