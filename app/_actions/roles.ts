'use server';

import { z } from 'zod';
import { defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const userRoleSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  roleId: z.string().min(1, 'Role is required'),
});

/**
 * Note the caches these mutations invalidate are `users`, not `roles` — no cache
 * has ever declared a `roles` tag, so the four `revalidateTag('roles')` calls
 * this file used to make were no-ops.
 */
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
