import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const FEATURES = [
  "date_filter",
  "age_filter",
  "gender_filter",
  "bar_chart_zoom",
  "date_picker",
  "reset_filter",
];

const GENDERS = ["Male", "Female", "Other"]; // ← plain strings, no enum

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

async function main() {
  console.log("🌱 Starting seed...\n");

  console.log("🧹 Clearing existing data...");
  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleared.\n");

  console.log("👤 Creating 10 users...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = [];

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        password: hashedPassword,
        age:      randomInt(15, 55),
        gender:   randomItem(GENDERS), 
      },
    });
    users.push(user);
    console.log(`  ✓ user${i}  age: ${user.age}  gender: ${user.gender}`);
  }

  console.log("\n📊 Creating 100 feature clicks...");
  const now = new Date();
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(now.getDate() - 90);

  for (let i = 0; i < 100; i++) {
    await prisma.featureClick.create({
      data: {
        user_id:      randomItem(users).id,
        feature_name: randomItem(FEATURES),
        timestamp:    randomDate(ninetyDaysAgo, now),
      },
    });
  }

  console.log("✅ Clicks created.\n");
  console.log("────────────────────────────────");
  console.log("🎉 Seed complete!");
  console.log(`   Users:          ${await prisma.user.count()}`);
  console.log(`   Feature Clicks: ${await prisma.featureClick.count()}`);
  console.log("────────────────────────────────");
  console.log("\n🔑 Login: username: user1  password: password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });