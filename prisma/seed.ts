import { faker } from '@faker-js/faker';
import type { User } from '@/prisma/generated/client';

import prisma from '../lib/db/client';

const createRandomWish = async (user: User, proposer?: User) => {
  console.log('creating wish for', user);
  const proposedBy = proposer ? proposer : user;
  return prisma.wish.upsert({
    where: { id: faker.string.uuid() },
    update: {},
    create: {
      name: faker.commerce.productName(),
      description: `${faker.commerce.productName()} - ${faker.commerce.productDescription()}`,
      url: faker.internet.url(),
      subject: { connect: user },
      proposer: { connect: proposedBy },
    },
  });
};

async function drop() {
  return Promise.all([
    prisma.wish.deleteMany(),
    prisma.user.deleteMany(),
    prisma.family.deleteMany(),
  ]);
}

async function main() {
  await drop();
  // Created rather than upserted: `drop()` has just emptied the table, and a
  // Family's name is a label with no unique index to look one up by.
  const christmasWishlist = await prisma.family.create({
    data: { name: 'Christmas Wishlist' },
  });

  const birthdayWishlist = await prisma.family.create({
    data: { name: 'Birthday Wishlist' },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: `Alice ${faker.person.fullName()}`,
      memberships: { create: { familyId: christmasWishlist.id } },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: `Bob ${faker.person.fullName()}`,
      memberships: { create: { familyId: christmasWishlist.id } },
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@example.com' },
    update: {},
    create: {
      email: 'carol@example.com',
      name: `Carol ${faker.person.fullName()}`,
    },
  });

  const dave = await prisma.user.upsert({
    where: { email: 'dave@example.com' },
    update: {},
    create: {
      email: 'dave@example.com',
      memberships: { create: { familyId: christmasWishlist.id } },
    },
  });

  const emily = await prisma.user.upsert({
    where: { email: 'emily@example.com' },
    update: {},
    create: {
      email: 'emily@example.com',
      name: `Emily ${faker.person.fullName()}`,
      memberships: {
        create: [
          { familyId: christmasWishlist.id },
          { familyId: birthdayWishlist.id },
        ],
      },
    },
  });

  const jonathan = await prisma.user.upsert({
    where: { email: 'jonathan@pulsifer.ca' },
    update: {},
    create: {
      email: 'jonathan@pulsifer.ca',
      name: 'Jonathan Seedifer',
      memberships: { create: { familyId: christmasWishlist.id } },
    },
  });

  await Promise.all([
    createRandomWish(alice),
    createRandomWish(alice),
    createRandomWish(alice),
    createRandomWish(alice),
    createRandomWish(alice),
    // bob
    createRandomWish(bob),
    createRandomWish(bob),
    createRandomWish(bob),
    createRandomWish(bob),
    // carol
    createRandomWish(carol),
    createRandomWish(carol),
    createRandomWish(carol),
    createRandomWish(carol),
    // dave
    createRandomWish(dave),
    createRandomWish(dave),
    // emily
    createRandomWish(emily),
    createRandomWish(emily),
    createRandomWish(emily),
    // jonathan
    createRandomWish(jonathan),
    createRandomWish(jonathan),
    createRandomWish(jonathan),
    createRandomWish(jonathan),
    createRandomWish(alice, jonathan),
    createRandomWish(alice, jonathan),
    createRandomWish(bob, jonathan),
  ]);
  console.log({ alice, bob, carol, dave, emily, jonathan });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
