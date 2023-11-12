import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	verifiedEmail: { type: Boolean, default: false },
	phoneNumber: { type: Number, required: true },
	age: { type: Number, required: true },

	admin: { type: Boolean, default: false },

	createdAt: { type: Date, default: new Date() },
	updatedAt: { type: Date, default: new Date() },
});

export const User = model("User", UserSchema, "User");
