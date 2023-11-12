import { Request } from "express";
import { User } from "../database/schema/user";
import { Types } from "mongoose";

declare global {
	namespace Express {
		interface Request {
			user: UserType | null;
			file: any;
		}
	}
}

export type UserType = {
	_id: string;
	firstName: string;
	lastName: string;
	password: string;
	email: string;
	verifiedEmail: boolean;
	phoneNumber: string;
	age: number;
	admin: boolean;

	createdAt: Date;
	updatedAt: Date;
};

export type BookType = {
	_id: string;
	title: string;
	description: string;
	tags: string;
	imageUrl?: string;

	price: number;
	inventoryStatus: "OUT_OF_STOCK" | "HIGH_STOCK" | "LOW_STOCK";
	stock: number;
	author: string;
	publisher?: string;

	createdAt: Date;
	updatedAt: Date;
};

export type OrderType = {
	_id: string;
	transactionId: string;
	userId: string;
	userEmail: string;
	products: (BookType & { quantity: number })[];
	totalPrice: number;
	transactionDetails: any;
	status: "PENDING" | "CREATED" | "CONFIRMED" | "DECLINED";

	createdAt: Date;
	updatedAt: Date;
};
