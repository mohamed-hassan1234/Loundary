const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Important for JWT cookies
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://sidra.somsoftsystems.com",
    "https://sidra.somsoftsystems.com",
    "http://www.sidra.somsoftsystems.com",
    "https://www.sidra.somsoftsystems.com"
  ],
  credentials: true
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/laundry", require("./routes/laundryRoutes"));
app.use("/api/ironing", require("./routes/ironingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/cashiers", require("./routes/cashierRoutes"));

// MongoDB Connection
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 