const prisma = require("../src/db/prismaClient");

const AVAILABLE_TRAITS = [
  'Organized', 'Creative', 'Outgoing', 'Analytical', 'Empathetic',
  'Adventurous', 'Detail-oriented', 'Team player', 'Independent', 'Optimistic',
];

const AVAILABLE_HOBBIES = [
  'Reading', 'Hiking', 'Cooking', 'Gaming', 'Photography',
  'Music', 'Sports', 'Travel', 'Art', 'Fitness', 'Dancing', 'Movies',
];

async function seedTraits() {
  for (const trait of AVAILABLE_TRAITS) {
    await prisma.trait.upsert({
      where: { trait },
      update: {},
      create: { trait },
    });
  }
  console.log("Traits seeded");
}

async function seedHobbies() {
  for (const hobby of AVAILABLE_HOBBIES) {
    await prisma.hobby.upsert({
      where: { hobby },
      update: {},
      create: { hobby },
    });
  }
  console.log("Hobbies seeded");
}

async function main() {
  await seedTraits();
  await seedHobbies();
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
