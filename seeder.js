import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import User from "./models/user.js";
import connectDB from "./config/db.js";

dotenv.config();

// Database connect
connectDB();

const importData = async () => {
  try {
    await User.deleteMany(); // saare purane users delete
    await User.insertMany(users); // naye users insert
    console.log("Users Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log("Users Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Command ke hisaab se function call
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
