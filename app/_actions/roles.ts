'use server';

import { z } from 'zod';
import { defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const DEFAULT_ROLES = [
  'godmode',
  'secret-santa-manager',
  'wishlist-manager',
] as const;

const userRoleSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  roleId: z.string().min(1, 'Role is required'),
});

/**
 * All roles, seeding the built-in ones on the way through.
 *
 * Note the caches invalidated by the role mutations below are `users`, not
 * `roles` — no cache has ever declared a `roles` tag, so the four
 * `revalidateTag('roles')` calls this file used to make were no-ops.
 */
export const getAllRoles = defineAction(
  { capability: 'manage:roles' },
  async () => {
    await db.$transaction(
      DEFAULT_ROLES.map((name) =>
        db.role.upsert({ where: { name }, update: {}, create: { name } }),
      ),
    );

    const roles = await db.role.findMany({
      select: {
        id: true,
        name: true,
        users: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return { roles };
  },
);

export const getAllUsersForRoles = defineAction(
  { capability: 'manage:roles' },
  async () => {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          select: { id: true, role: { select: { id: true, name: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });
    return { users };
  },
);

export const createRole = defineAction(
  {
    capability: 'manage:roles',
    input: z.string().trim().min(1, 'Role name is required').max(64),
    invalidates: ['users'],
  },
  async ({ input: name }) => {
    const role = await db.role.create({ data: { name } });
    return { role, message: `${name} created` };
  },
);

export const assignRoleToUser = defineAction(
  { capability: 'manage:roles', input: userRoleSchema, invalidates: ['users'] },
  async ({ input: { userId, roleId } }) => {
    const userRole = await db.userRole.create({
      data: { userId, roleId },
      select: {
        id: true,
        user: { select: { id: true, name: true, email: true } },
        role: { select: { id: true, name: true } },
      },
    });
    return { userRole, message: 'Role assigned' };
  },
);

export const removeRoleFromUser = defineAction(
  { capability: 'manage:roles', input: userRoleSchema, invalidates: ['users'] },
  async ({ input: { userId, roleId } }) => {
    await db.userRole.deleteMany({ where: { userId, roleId } });
    return { message: 'Role removed' };
  },
);

export const deleteRole = defineAction(
  {
    capability: 'manage:roles',
    input: z.string().min(1, 'Role is required'),
    invalidates: ['users'],
  },
  async ({ input: roleId }) => {
    await db.$transaction([
      db.userRole.deleteMany({ where: { roleId } }),
      db.role.delete({ where: { id: roleId } }),
    ]);
    return { message: 'Role deleted' };
  },
);
