import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = mongoose.Schema({
  fullName: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  zip: String,
  country: String
}, { _id: false });

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  address: [addressSchema],

  // Wishlist Feature
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
}, { timestamps: true });

// Password hashing before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match function
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
