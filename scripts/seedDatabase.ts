// seeds/roles.seed.ts
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

async function main() {
  const devRoleId = '17a411dc-ed38-4470-8aad-3aec455b3146';
  const adminRoleId = 'fe0d7e86-d2b5-4180-a090-ab20ead2efc8';
  const userRoleId = 'ec91dfd2-f32e-486d-8ef9-626072cc0504';

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
      permissions: userPermissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
    {
      id: adminRoleId,
      name: 'Admin',
      permissions: adminPermissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
    {
      id: devRoleId,
      name: 'Dev',
      permissions: permissions.map((permission) => ({
        assignedBy: 'system',
        assignedAt: dayjs().toDate(),
        permissionId: permission.id,
      })),
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
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
