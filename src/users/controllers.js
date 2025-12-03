import User from "./model.js";

// Create a new user (Signup)
async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    await newUser.save();

    // Return user without password
    const userResponse = newUser.toJSON();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    // Handle validation errors from mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
}

// Login user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Return user without password
    const userResponse = user.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
}

// Get user profile by ID
async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
}

// Update user profile
async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Validate userId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Fields that cannot be updated
    const restrictedFields = ["password", "email", "_id", "createdAt"];
    const updateKeys = Object.keys(updates);

    // Check if any restricted field is being updated
    const hasRestrictedField = updateKeys.some((field) =>
      restrictedFields.includes(field)
    );

    if (hasRestrictedField) {
      return res.status(400).json({
        success: false,
        message: "Cannot update restricted fields (email, password, id)",
      });
    }

    // Validate bio length if provided
    if (updates.bio && updates.bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Bio cannot exceed 500 characters",
      });
    }

    // Validate graduation year if provided
    if (updates.graduation_year) {
      const year = parseInt(updates.graduation_year);
      if (year < 2020 || year > 2100) {
        return res.status(400).json({
          success: false,
          message: "Graduation year must be between 2020 and 2100",
        });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate profile completeness after update
    user.calculateProfileCompleteness();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
}

// Delete user account
async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
}

// Get all users with pagination
async function getAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const users = await User.find({ isActive: true })
      .select("-password")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      users,
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
}

// Get all public users
async function getAllPublicusers(req, res) {
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const users = await User.find({ isActive: true , isPublic: true })
      .select("-password")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

 
    const total = await User.countDocuments({ isActive: true , isPublic: true });

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      users,
    });
  } catch (error) {
    console.error("GET PUBLIC USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
}

// Search users by name or username
async function searchUsers(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query.trim(), "i");

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { leetcode_username: searchRegex },
        { codeforces_username: searchRegex },
        { codechef_username: searchRegex },
        { gfg_username: searchRegex },
      ],
      isActive: true,
    })
      .select("-password")
      .limit(20);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
}

// Update user password
async function updatePassword(req, res) {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Validate userId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
}

// Deactivate user account
async function deactivateAccount(req, res) {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!userId || userId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("DEACTIVATE ACCOUNT ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error deactivating account",
      error: error.message,
    });
  }
}

// Get leaderboard (users ranked by activity/stats)
async function getLeaderboard(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    // Get users with competitive programming profiles
    const users = await User.find({
      $or: [
        { leetcode_username: { $ne: null } },
        { codeforces_username: { $ne: null } },
        { codechef_username: { $ne: null } },
        { gfg_username: { $ne: null } },
      ],
      isActive: true,
      isPublic: true,
    })
      .select("-password")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({
      $or: [
        { leetcode_username: { $ne: null } },
        { codeforces_username: { $ne: null } },
        { codechef_username: { $ne: null } },
        { gfg_username: { $ne: null } },
      ],
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
      leaderboard: users,
    });
  } catch (error) {
    console.error("GET LEADERBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching leaderboard",
      error: error.message,
    });
  }
}

const userControllers = {
  createUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllPublicusers,
  searchUsers,
  updatePassword,
  deactivateAccount,
  getLeaderboard,
};

export default userControllers;