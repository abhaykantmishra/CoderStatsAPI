import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default in queries
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Competitive programming profiles
    leetcode_username: {
      type: String,
      trim: true,
      default: null,
    },
    codeforces_username: {
      type: String,
      trim: true,
      default: null,
    },
    codechef_username: {
      type: String,
      trim: true,
      default: null,
    },
    gfg_username: {
      type: String,
      trim: true,
      default: null,
    },

    // User details
    college: {
      type: String,
      default: null,
    },
    graduation_year: {
      type: Number,
      min: [2000, "Invalid graduation year"],
      max: [2100, "Invalid graduation year"],
      default: null,
    },
    bio: {
      type: String,
      default: null,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    avatar: {
      type: String,
      default: null,
    },

    // Social profiles
    twitter_username: {
      type: String,
      trim: true,
      default: null,
    },
    github_username: {
      type: String,
      trim: true,
      default: null,
    },
    linkedin_username: {
      type: String,
      trim: true,
      default: null,
    },

    // User status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },

    // Profile completeness tracking
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Last login tracking
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
    console.log("ERROR: ", error)
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate profile completeness
userSchema.methods.calculateProfileCompleteness = function () {
  const fields = [
    "bio",
    "avatar",
    "graduation_year",
    "twitter_username",
    "github_username",
    "linkedin_username",
    "leetcode_username",
    "codeforces_username",
    "codechef_username",
    "gfg_username",
  ];

  let filledFields = 0;
  fields.forEach((field) => {
    if (this[field] && this[field] !== null) {
      filledFields++;
    }
  });

  this.profileCompleteness = Math.round((filledFields / fields.length) * 100);
  return this.profileCompleteness;
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  return await this.save();
};

// Method to hide sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = model("user", userSchema);

export default User;
