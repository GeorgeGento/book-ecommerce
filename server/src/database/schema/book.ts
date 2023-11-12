import { Schema, model } from "mongoose";

const BookSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	tags: { type: String, required: true },
	imageUrl: { type: String, default: undefined },

	price: { type: Number, required: true },
	inventoryStatus: { type: String, default: "OUT_OF_STOCK" },
	stock: { type: Number, default: 0 },
	author: { type: String, required: true },
	publisher: { type: String, default: undefined },

	createdAt: { type: Date, default: new Date() },
	updatedAt: { type: Date, default: new Date() },
});

export const Book = model("Book", BookSchema, "Book");
