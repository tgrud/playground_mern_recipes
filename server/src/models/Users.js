import mongoose from "mongoose";

// Defines the user (will change later)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: "recipes"}]
})

// "users" is the collection name on MongoDB
// This userModel is going to be used to make calls to this collection
export const UserModel = mongoose.model("users", UserSchema)

