import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
	transactionId: { type: String, required: true },
	userId: { type: String, required: true },
	userEmail: { type: String, required: true },
	totalPrice: { type: Number, required: true },
	products: { type: Array, default: [] },
	transactionDetails: { type: Object, default: null },
	status: { type: String, required: true },

	createdAt: { type: Date, default: new Date() },
	updatedAt: { type: Date, default: new Date() },
});

export const Order = model("Order", OrderSchema, "Order");