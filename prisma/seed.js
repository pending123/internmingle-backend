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

const USERS = [
  {
    clerkId: "clerk_1",
    profileCompleted: true,
    firstName: "Alice",
    lastName: "Smith",
    birthday: new Date("2003-05-14"),
    bio: "Passionate about building scalable web apps.",
    gender: "Female",
    university: "UC Berkeley",
    company: "TechCorp",
    workPosition: "Software Engineer Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Early Bird",
    numOfRoomates: 2,
    noiseLevel: "Quiet",
    traits: ['Organized', 'Analytical', 'Team player'],
    hobbies: ['Reading', 'Hiking', 'Cooking'],
  },
  {
    clerkId: "clerk_2",
    profileCompleted: true,
    firstName: "Bob",
    lastName: "Johnson",
    birthday: new Date("2004-11-21"),
    bio: "Aspiring product manager who loves user experience.",
    gender: "Male",
    university: "Stanford University",
    company: "InnoSoft",
    workPosition: "Product Manager Intern",
    workCity: "San Francisco",
    schoolMajor: "Business Administration",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Outgoing', 'Creative', 'Optimistic'],
    hobbies: ['Gaming', 'Music', 'Travel'],
  },
  {
    clerkId: "clerk_3",
    profileCompleted: true,
    firstName: "Charlie",
    lastName: "Brown",
    birthday: new Date("2003-02-09"),
    bio: "UX design enthusiast focused on accessibility.",
    gender: "Male",
    university: "San Francisco State University",
    company: "WebSolutions",
    workPosition: "UX Designer Intern",
    workCity: "San Francisco",
    schoolMajor: "Design",
    isLookingForHousing: true,
    sleepSchedule: "Night Owl",
    numOfRoomates: 1,
    noiseLevel: "Moderate",
    traits: ['Empathetic', 'Creative', 'Detail-oriented'],
    hobbies: ['Photography', 'Art', 'Movies'],
  },
  {
    clerkId: "clerk_4",
    profileCompleted: true,
    firstName: "Diana",
    lastName: "Lopez",
    birthday: new Date("2004-07-19"),
    bio: "Data science student passionate about AI.",
    gender: "Female",
    university: "UC Berkeley",
    company: "DataMinds",
    workPosition: "Data Science Intern",
    workCity: "San Francisco",
    schoolMajor: "Data Science",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Analytical', 'Independent', 'Optimistic'],
    hobbies: ['Gaming', 'Reading', 'Fitness'],
  },
  {
    clerkId: "clerk_5",
    profileCompleted: true,
    firstName: "Ethan",
    lastName: "Williams",
    birthday: new Date("2003-08-10"),
    bio: "Interested in cybersecurity and ethical hacking.",
    gender: "Male",
    university: "Stanford University",
    company: "SecureNet",
    workPosition: "Security Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Early Bird",
    numOfRoomates: 3,
    noiseLevel: "Quiet",
    traits: ['Detail-oriented', 'Organized', 'Independent'],
    hobbies: ['Hiking', 'Music', 'Sports'],
  },
  {
    clerkId: "clerk_6",
    profileCompleted: true,
    firstName: "Fiona",
    lastName: "Garcia",
    birthday: new Date("2004-01-25"),
    bio: "Creative coder and UI/UX designer.",
    gender: "Female",
    university: "San Francisco State University",
    company: "PixelCraft",
    workPosition: "UI/UX Intern",
    workCity: "San Francisco",
    schoolMajor: "Design",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Creative', 'Team player', 'Outgoing'],
    hobbies: ['Photography', 'Art', 'Dancing'],
  },
  {
    clerkId: "clerk_7",
    profileCompleted: true,
    firstName: "George",
    lastName: "Miller",
    birthday: new Date("2003-06-05"),
    bio: "Love solving problems with code and algorithms.",
    gender: "Male",
    university: "UC Berkeley",
    company: "AlgoTech",
    workPosition: "Software Engineering Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Night Owl",
    numOfRoomates: 2,
    noiseLevel: "Moderate",
    traits: ['Analytical', 'Organized', 'Team player'],
    hobbies: ['Gaming', 'Reading', 'Travel'],
  },
  {
    clerkId: "clerk_8",
    profileCompleted: true,
    firstName: "Hannah",
    lastName: "Davis",
    birthday: new Date("2004-04-14"),
    bio: "Enthusiastic about cloud computing and devops.",
    gender: "Female",
    university: "Stanford University",
    company: "CloudWave",
    workPosition: "DevOps Intern",
    workCity: "San Francisco",
    schoolMajor: "Information Technology",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Independent', 'Detail-oriented', 'Optimistic'],
    hobbies: ['Fitness', 'Travel', 'Music'],
  },
  {
    clerkId: "clerk_9",
    profileCompleted: true,
    firstName: "Ian",
    lastName: "Martinez",
    birthday: new Date("2003-12-11"),
    bio: "Passionate about mobile app development.",
    gender: "Male",
    university: "San Francisco State University",
    company: "AppVentures",
    workPosition: "Mobile Developer Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Early Bird",
    numOfRoomates: 1,
    noiseLevel: "Quiet",
    traits: ['Creative', 'Team player', 'Outgoing'],
    hobbies: ['Gaming', 'Sports', 'Movies'],
  },
  {
    clerkId: "clerk_10",
    profileCompleted: true,
    firstName: "Julia",
    lastName: "Hernandez",
    birthday: new Date("2004-09-02"),
    bio: "Focused on machine learning and AI ethics.",
    gender: "Female",
    university: "UC Berkeley",
    company: "AIMinds",
    workPosition: "Machine Learning Intern",
    workCity: "San Francisco",
    schoolMajor: "Data Science",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Empathetic', 'Analytical', 'Organized'],
    hobbies: ['Reading', 'Music', 'Art'],
  },
  {
    clerkId: "clerk_11",
    profileCompleted: true,
    firstName: "Kevin",
    lastName: "Wilson",
    birthday: new Date("2003-07-23"),
    bio: "Backend developer passionate about databases.",
    gender: "Male",
    university: "Stanford University",
    company: "DataStream",
    workPosition: "Backend Developer Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Night Owl",
    numOfRoomates: 2,
    noiseLevel: "Moderate",
    traits: ['Organized', 'Detail-oriented', 'Independent'],
    hobbies: ['Sports', 'Cooking', 'Hiking'],
  },
  {
    clerkId: "clerk_12",
    profileCompleted: true,
    firstName: "Lily",
    lastName: "Moore",
    birthday: new Date("2004-02-28"),
    bio: "Frontend developer who loves creating beautiful UIs.",
    gender: "Female",
    university: "San Francisco State University",
    company: "BrightUI",
    workPosition: "Frontend Developer Intern",
    workCity: "San Francisco",
    schoolMajor: "Design",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Creative', 'Outgoing', 'Team player'],
    hobbies: ['Dancing', 'Art', 'Movies'],
  },
  {
    clerkId: "clerk_13",
    profileCompleted: true,
    firstName: "Michael",
    lastName: "Taylor",
    birthday: new Date("2003-03-17"),
    bio: "Interested in full stack development and cloud apps.",
    gender: "Male",
    university: "UC Berkeley",
    company: "FullStackify",
    workPosition: "Full Stack Intern",
    workCity: "San Francisco",
    schoolMajor: "Computer Science",
    isLookingForHousing: true,
    sleepSchedule: "Early Bird",
    numOfRoomates: 3,
    noiseLevel: "Quiet",
    traits: ['Organized', 'Team player', 'Analytical'],
    hobbies: ['Gaming', 'Travel', 'Fitness'],
  },
  {
    clerkId: "clerk_14",
    profileCompleted: true,
    firstName: "Nina",
    lastName: "Anderson",
    birthday: new Date("2004-06-30"),
    bio: "Cybersecurity enthusiast learning about network defense.",
    gender: "Female",
    university: "Stanford University",
    company: "SecureNet",
    workPosition: "Security Intern",
    workCity: "San Francisco",
    schoolMajor: "Information Security",
    isLookingForHousing: false,
    sleepSchedule: null,
    numOfRoomates: null,
    noiseLevel: null,
    traits: ['Detail-oriented', 'Independent', 'Analytical'],
    hobbies: ['Reading', 'Fitness', 'Cooking'],
  },
  {
    clerkId: "clerk_15",
    profileCompleted: true,
    firstName: "Oliver",
    lastName: "King",
    birthday: new Date("2003-10-08"),
    bio: "Data analyst intern interested in big data and visualization.",
    gender: "Male",
    university: "San Francisco State University",
    company: "DataMinds",
    workPosition: "Data Analyst Intern",
    workCity: "San Francisco",
    schoolMajor: "Data Science",
    isLookingForHousing: true,
    sleepSchedule: "Night Owl",
    numOfRoomates: 2,
    noiseLevel: "Moderate",
    traits: ['Analytical', 'Optimistic', 'Team player'],
    hobbies: ['Photography', 'Travel', 'Music'],
  },
];

async function seedUsers() {
  for (const user of USERS) {
    // Create user
    const createdUser = await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: {
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        bio: user.bio,
        gender: user.gender,
        university: user.university,
        company: user.company,
        workPosition: user.workPosition,
        workCity: user.workCity,
        schoolMajor: user.schoolMajor,
        isLookingForHousing: user.isLookingForHousing,
        sleepSchedule: user.sleepSchedule,
        numOfRoomates: user.numOfRoomates,
        noiseLevel: user.noiseLevel,
      },
      create: {
        clerkId: user.clerkId,
        profileCompleted: user.profileCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        bio: user.bio,
        gender: user.gender,
        university: user.university,
        company: user.company,
        workPosition: user.workPosition,
        workCity: user.workCity,
        schoolMajor: user.schoolMajor,
        isLookingForHousing: user.isLookingForHousing,
        sleepSchedule: user.sleepSchedule,
        numOfRoomates: user.numOfRoomates,
        noiseLevel: user.noiseLevel,
      },
    });

    // Connect traits
    for (const traitName of user.traits) {
      const trait = await prisma.trait.findUnique({ where: { trait: traitName } });
      if (trait) {
        await prisma.userTrait.upsert({
          where: { userId_traitId: { userId: createdUser.userId, traitId: trait.traitId } },
          update: {},
          create: {
            userId: createdUser.userId,
            traitId: trait.traitId,
          },
        });
      }
    }

    // Connect hobbies
    for (const hobbyName of user.hobbies) {
      const hobby = await prisma.hobby.findUnique({ where: { hobby: hobbyName } });
      if (hobby) {
        await prisma.userHobby.upsert({
          where: { userId_hobbyId: { userId: createdUser.userId, hobbyId: hobby.hobbyId } },
          update: {},
          create: {
            userId: createdUser.userId,
            hobbyId: hobby.hobbyId,
          },
        });
      }
    }
  }

  console.log("Users seeded");
}

async function main() {
  await seedTraits();
  await seedHobbies();
  await seedUsers();
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });