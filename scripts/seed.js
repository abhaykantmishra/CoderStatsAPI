import "dotenv/config";
import { connectDB, disconnectDB } from "../src/config/database.js";
import User from "../src/users/model.js";

/**
 * Sample users for seeding
 */
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    bio: "Full stack developer passionate about competitive programming",
    graduation_year: 2024,
    twitter_username: "johndoe",
    github_username: "johndoe",
    linkedin_username: "johndoe",
    leetcode_username: "john_doe",
    codeforces_username: "johndoe",
    codechef_username: "johndoe",
    gfg_username: "johndoe",
    isPublic: true,
    isVerified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    bio: "Data scientist and ML enthusiast",
    graduation_year: 2023,
    twitter_username: "janesmith",
    github_username: "janesmith",
    linkedin_username: "janesmith",
    leetcode_username: "jane_smith",
    codeforces_username: "janesmith",
    codechef_username: "janesmith",
    isPublic: true,
    isVerified: true,
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
    bio: "Frontend developer",
    graduation_year: 2025,
    twitter_username: "alicejohnson",
    github_username: "alicejohnson",
    linkedin_username: "alicejohnson",
    leetcode_username: "alice_j",
    isPublic: true,
    isVerified: false,
  },
  {
    name: "Bob Wilson",
    email: "bob@example.com",
    password: "password123",
    bio: "Backend developer",
    graduation_year: 2023,
    github_username: "bobwilson",
    linkedin_username: "bobwilson",
    codeforces_username: "bobwilson",
    isPublic: false,
    isVerified: true,
  },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
    bio: "DevOps engineer",
    graduation_year: 2022,
    github_username: "charliebrown",
    linkedin_username: "charliebrown",
    gfg_username: "charliebrown",
    isPublic: true,
    isVerified: true,
  },
];

/**
 * Seed the database with sample data
 */
async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();

    // Clear existing users
    console.log("Clearing existing users...");
    await User.deleteMany({});

    // Insert sample users
    console.log("Seeding sample users...");
    const createdUsers = await User.insertMany(sampleUsers);

    // Calculate profile completeness for each user
    console.log("Calculating profile completeness...");
    for (const user of createdUsers) {
      user.calculateProfileCompleteness();
      await user.save();
    }

    console.log(`Successfully seeded ${createdUsers.length} users`);

    // Display sample user info
    console.log("Sample Users Created:");
    console.log("================================");
    for (const user of createdUsers) {
      console.log(`
  Name: ${user.name}
  Email: ${user.email}
  Profile Completeness: ${user.profileCompleteness}%
  Public: ${user.isPublic}
  ID: ${user._id}
      `);
    }

    // Disconnect
    await disconnectDB();
  } catch (error) {
    console.error("Error seeding database:", error);
    await disconnectDB();
    process.exit(1);
  }
}

/**
 * Clean up database (remove all users)
 */
async function cleanDatabase() {
  try {
    await connectDB();

    console.log("🗑️  Cleaning database...");
    const result = await User.deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} users`);

    await disconnectDB();
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    await disconnectDB();
    process.exit(1);
  }
}

// Run seeding or cleaning based on command line argument
const command = process.argv[2];

if (command === "clean") {
  cleanDatabase();
} else if (command === "seed") {
  seedDatabase();
} else {
  console.log("Usage:");
  console.log("  npm run seed:db          - Seed database with sample data");
  console.log("  npm run seed:clean       - Clear all users from database");
}
