import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role : { type: String, enum: ["User", "Admin"], default: "User" },
  timeStamp: { type: Date, default: Date.now }
}, {
  collection: 'users' // explicitly specify collection name (lowercase, plural)
});

const User = mongoose.model("User", userSchema);

export default User;
