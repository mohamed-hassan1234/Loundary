const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Send JWT in cookies
const sendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRETKEY",
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return token;
};

// Admin Register
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, name, secretKey } = req.body;

    if (secretKey !== "ADMIN-SECRET-123") {
      return res.status(403).json({ error: "Invalid Admin Secret Key" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const user = new User({ username, password, name, role: "admin" });
    await user.save();

    res.json({ message: "Admin registered", user });

  } catch (error) {
    console.log("REGISTER ADMIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Cashier Register
exports.registerCashier = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    const user = new User({ username, password, name, role: "cashier" });
    await user.save();

    res.json({ message: "Cashier registered", user });

  } catch (error) {
    console.log("REGISTER CASHIER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all cashiers
exports.getAllCashiers = async (req, res) => {
  try {
    const cashiers = await User.find({ role: "cashier" }).select("-password");
    res.json(cashiers);
  } catch (error) {
    console.log("GET CASHIERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update cashier
exports.updateCashier = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, name } = req.body;

    const updateData = { username, name };
    
    // Only update password if provided
    if (password && password.trim() !== "") {
      const user = await User.findById(id);
      if (user) {
        user.password = password;
        await user.save();
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Cashier not found" });
    }

    res.json({ message: "Cashier updated successfully", user: updatedUser });
  } catch (error) {
    console.log("UPDATE CASHIER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete cashier
exports.deleteCashier = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: "Cashier not found" });
    }

    res.json({ message: "Cashier deleted successfully" });
  } catch (error) {
    console.log("DELETE CASHIER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    sendToken(user, res);
    res.json({ message: "Logged in", user });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    // Assuming you have middleware that adds user to req
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, name, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update basic info
    user.username = username || user.username;
    user.name = name || user.name;

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set new password" });
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      user.password = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(userId).select("-password");
    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete account (requires password verification)
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Clear cookie
    res.clearCookie("token");
    
    res.json({ message: "Account deleted successfully" });

  } catch (error) {
    console.log("DELETE ACCOUNT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    // Use req.user._id (from middleware)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, name, currentPassword, newPassword } = req.body;
    const userId = req.user._id; // Use _id from middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update basic info
    user.username = username || user.username;
    user.name = name || user.name;

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set new password" });
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      
      user.password = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(userId).select("-password");
    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete account (requires password verification)
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id; // Use _id from middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Clear cookie
    res.clearCookie("token");
    
    res.json({ message: "Account deleted successfully" });

  } catch (error) {
    console.log("DELETE ACCOUNT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Admin Profile Functions
exports.getAdminProfile = async (req, res) => {
  try {
    // Get admin user from middleware - use req.user (already populated by middleware)
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        error: "Admin not found" 
      });
    }
    
    // Verify it's an admin
    if (user.role !== "admin") {
      return res.status(403).json({ 
        error: "Admin access required" 
      });
    }
    
    res.json(user); // Return user directly, not wrapped in success/data
  } catch (error) {
    console.log("GET ADMIN PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { username, name, currentPassword, newPassword, secretKey } = req.body;
    const userId = req.user._id; // Use _id from middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: "Admin not found" 
      });
    }

    // Verify it's an admin
    if (user.role !== "admin") {
      return res.status(403).json({ 
        error: "Admin access required" 
      });
    }

    // If updating secret key, verify it
    if (secretKey) {
      if (secretKey !== "ADMIN-SECRET-123") {
        return res.status(403).json({ 
          error: "Invalid admin secret key" 
        });
      }
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ 
          error: "Username already exists" 
        });
      }
      user.username = username;
    }

    // Update name
    if (name) user.name = name;

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          error: "Current password is required" 
        });
      }
      
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ 
          error: "Current password is incorrect" 
        });
      }
      
      user.password = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(userId).select("-password");
    
    res.json({ 
      message: "Admin profile updated successfully", 
      user: updatedUser 
    });

  } catch (error) {
    console.log("UPDATE ADMIN PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};