'use server';

import { revalidateTag } from 'next/cache';
import { getSession, isGodmode } from '@/app/auth';
import db from '@/lib/db/client';

// Role management actions
export const getAllRoles = async () => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const roles = await db.role.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { roles };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching roles' };
  }
};

export const getAllUsersForRoles = async () => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { users };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching users' };
  }
};

export const createRole = async (name: string) => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const role = await db.role.create({
      data: {
        name,
      },
    });

    revalidateTag('roles');
    return { role };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong creating role' };
  }
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const userRole = await db.userRole.create({
      data: {
        userId,
        roleId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    revalidateTag('roles');
    revalidateTag('users');
    return { userRole };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong assigning role' };
  }
};

export const removeRoleFromUser = async (userId: string, roleId: string) => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    await db.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });

    revalidateTag('roles');
    revalidateTag('users');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong removing role' };
  }
};

export const deleteRole = async (roleId: string) => {
  try {
    const { user } = await getSession();

    if (!isGodmode(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    // First remove all user assignments for this role
    await db.userRole.deleteMany({
      where: {
        roleId,
      },
    });

    // Then delete the role
    await db.role.delete({
      where: {
        id: roleId,
      },
    });

    revalidateTag('roles');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong deleting role' };
  }
};
