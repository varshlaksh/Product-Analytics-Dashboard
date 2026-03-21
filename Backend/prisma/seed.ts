import { PrismaClient, Gender } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ── Config ──
const TOTAL_USERS = 10;
const TOTAL_CLICKS = 100;

const FEATURES = [
  "date_filter",
  "age_filter",
  "gender_filter",
  "bar_chart_zoom",
  "date_picker",
  "reset_filter",
];

const GENDERS: Gender[] = [Gender.Male, Gender.Female, Gender.Other];

// ── Helpers ──
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// ── Main ──
async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Clean existing data
  console.log("🧹 Clearing existing data...");
  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared.\n");

  // 2. Create 10 users
  console.log(`👤 Creating ${TOTAL_USERS} users...`);

  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = [];

  for (let i = 1; i <= TOTAL_USERS; i++) {
    const gender = randomItem(GENDERS);
    const age    = randomInt(15, 55);

    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        password: hashedPassword,
        age,
        gender,
      },
    });

    users.push(user);
    console.log(`  ✓ user${i}  age: ${age}  gender: ${gender}`);
  }

  // 3. Create 100 feature click events spread across last 90 days
  console.log(`\n📊 Creating ${TOTAL_CLICKS} feature clicks...`);

  const now          = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);

  for (let i = 0; i < TOTAL_CLICKS; i++) {
    const user      = randomItem(users);
    const feature   = randomItem(FEATURES);
    const timestamp = randomDate(ninetyDaysAgo, now);

    await prisma.featureClick.create({
      data: {
        user_id:      user.id,
        feature_name: feature,
        timestamp,
      },
    });
  }

  console.log("✅ Clicks created.\n");

  // 4. Print summary
  const userCount  = await prisma.user.count();
  const clickCount = await prisma.featureClick.count();

  console.log("────────────────────────────");
  console.log("🎉 Seed complete!");
  console.log(`   Users:          ${userCount}`);
  console.log(`   Feature Clicks: ${clickCount}`);
  console.log("────────────────────────────");
  console.log("\n🔑 Login credentials:");
  console.log("   username: user1  (or user2 … user10)");
  console.log("   password: password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });