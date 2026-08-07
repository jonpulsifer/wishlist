import { faker } from '@faker-js/faker';
import type { User } from '@/prisma/generated/client';

import prisma from '../lib/db/client';

const createRandomGift = async (user: User, recipient?: User) => {
  console.log('creating gift for', user);
  const sender = recipient ? recipient : user;
  return prisma.gift.upsert({
    where: { id: faker.string.uuid() },
    update: {},
    create: {
      name: faker.commerce.productName(),
      description: `${faker.commerce.productName()} - ${faker.commerce.productDescription()}`,
      url: faker.internet.url(),
      owner: { connect: user },
      createdBy: { connect: sender },
    },
  });
};

async function drop() {
  return Promise.all([
    prisma.gift.deleteMany(),
    prisma.user.deleteMany(),
    prisma.wishlist.deleteMany(),
  ]);
}

async function main() {
  await drop();
  const christmasWishlist = await prisma.wishlist.upsert({
    where: { name: 'Christmas Wishlist' },
    update: {},
    create: {
      name: 'Christmas Wishlist',
      password: '1234',
    },
  });

  const birthdayWishlist = await prisma.wishlist.upsert({
    where: { name: 'Birthday Wishlist' },
    update: {},
    create: {
      name: 'Birthday Wishlist',
      password: '1234',
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: `Alice ${faker.person.fullName()}`,
      wishlists: {
        connect: christmasWishlist,
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: `Bob ${faker.person.fullName()}`,
      wishlists: {
        connect: christmasWishlist,
      },
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
      wishlists: { connect: christmasWishlist },
    },
  });

  const emily = await prisma.user.upsert({
    where: { email: 'emily@example.com' },
    update: {},
    create: {
      email: 'emily@example.com',
      name: `Emily ${faker.person.fullName()}`,
      wishlists: { connect: [christmasWishlist, birthdayWishlist] },
    },
  });

  const jonathan = await prisma.user.upsert({
    where: { email: 'jonathan@pulsifer.ca' },
    update: {},
    create: {
      email: 'jonathan@pulsifer.ca',
      name: 'Jonathan Seedifer',
      wishlists: { connect: [christmasWishlist] },
    },
  });

  await Promise.all([
    createRandomGift(alice),
    createRandomGift(alice),
    createRandomGift(alice),
    createRandomGift(alice),
    createRandomGift(alice),
    // bob
    createRandomGift(bob),
    createRandomGift(bob),
    createRandomGift(bob),
    createRandomGift(bob),
    // carol
    createRandomGift(carol),
    createRandomGift(carol),
    createRandomGift(carol),
    createRandomGift(carol),
    // dave
    createRandomGift(dave),
    createRandomGift(dave),
    // emily
    createRandomGift(emily),
    createRandomGift(emily),
    createRandomGift(emily),
    // jonathan
    createRandomGift(jonathan),
    createRandomGift(jonathan),
    createRandomGift(jonathan),
    createRandomGift(jonathan),
    createRandomGift(alice, jonathan),
    createRandomGift(alice, jonathan),
    createRandomGift(bob, jonathan),
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
