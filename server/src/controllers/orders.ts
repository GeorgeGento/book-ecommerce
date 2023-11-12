import { NextFunction, Request, Response } from "express";
import { Order } from "../database/schema/order";
import { OrderType } from "../types";
import { Book } from "../database/schema/book";

export const getOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skip, limit } = req.query;
		let currentSkip = skip ? parseInt(skip as string) : 0;
		let currentLimit = limit ? parseInt(limit as string) : 15;
		currentLimit = currentLimit < 1 ? 15 : currentLimit;

		let result = await Order.aggregate([
			{
				$match: {},
			},
			{
				$facet: {
					metaData: [{ $count: "totalOrders" }],
					data: [{ $skip: currentSkip }, { $limit: currentLimit }],
				},
			},
		]);

		result = result[0];
		const data = {
			//@ts-ignore
			metadata: { ...result.metaData[0], count: result.data.length },
			//@ts-ignore
			data: result.data,
		};

		return res.status(200).json(data);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const getUserOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		if (!userId)
			return res.status(400).json({ message: "userId is required." });

		const { skip, limit } = req.query;
		let currentSkip = skip ? parseInt(skip as string) : 0;
		let currentLimit = limit ? parseInt(limit as string) : 15;
		currentLimit = currentLimit < 1 ? 15 : currentLimit;

		let result = await Order.aggregate([
			{
				$match: { userId },
			},
			{
				$facet: {
					metaData: [{ $count: "totalOrders" }],
					data: [{ $skip: currentSkip }, { $limit: currentLimit }],
				},
			},
		]);

		result = result[0];
		const data = {
			//@ts-ignore
			metadata: { ...result.metaData[0], count: result.data.length },
			//@ts-ignore
			data: result.data,
		};

		return res.status(200).json(data);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const getOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { orderId } = req.params;
		if (!orderId)
			return res.status(400).json({ message: "OrderId is required." });

		const order = await Order.findOne({ _id: orderId }).lean();
		if (!order)
			return res
				.status(404)
				.json({ message: `Order with id: ${orderId} does not exist.` });

		const productsId = order.products.map((item) => item._id);
		order.products = await Book.find({ _id: { $in: productsId } }).lean();

		return res.status(200).json(order);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const postOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orderBody = req.body;
		if (!isOrder(orderBody))
			return res.status(400).json({ message: "All fields required." });

		const {
			_id,
			userId,
			userEmail,
			totalPrice,
			transactionId,
			transactionDetails,
			status,
			products,
		} = orderBody;
		if (!products.length)
			return res.status(409).json({
				message: "Empty products list.",
			});

		const existedOrder = await Order.findOne({ userId, _id });
		if (existedOrder)
			return res.status(409).json({
				message: "Order already exists.",
			});

		const productsId = products.map((p) => p._id);
		const books = await Book.find({ _id: { $in: productsId } }).lean();
		if (productsId.length !== books.length)
			return res.status(409).json({ message: "Invalid products detected." });

		for (const product of products) {
			const book = books.find((b) => b._id.toString() === product._id);
			if (!book)
				return res.status(409).json({ message: "Invalid products detected." });

			if (product.quantity > book.stock)
				return res
					.status(409)
					.json({ message: "Invalid product quantity detected." });

			const stock = book.stock - product.quantity;
			const inventoryStatus =
				stock <= 0 ? "OUT_OF_STOCK" : stock > 20 ? "HIGH_STOCK" : "LOW_STOCK";

			await Book.findOneAndUpdate(
				{ _id: book._id },
				{
					stock,
					inventoryStatus,
				},
				{ upsert: true }
			);
		}

		const newOrder = await Order.create({
			userId,
			userEmail,
			totalPrice,
			transactionId,
			transactionDetails,
			products,
			status,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return res.status(201).json(newOrder);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const patchOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { orderId } = req.params;
		if (!orderId)
			return res.status(400).json({ message: "OrderId is required." });

		const orderBody = req.body;
		if (!isOrder(orderBody))
			return res.status(400).json({ message: "All fields required." });

		const {
			_id,
			userId,
			userEmail,
			totalPrice,
			transactionId,
			transactionDetails,
			status,
			products,
		} = orderBody;
		const existedOrder = await Order.findOne({ userId, _id });
		if (!existedOrder)
			return res.status(404).json({
				message: `Order with id: ${orderId} not found.`,
			});

		existedOrder.userEmail = userEmail;
		existedOrder.totalPrice = totalPrice;
		existedOrder.transactionDetails = transactionDetails;
		existedOrder.transactionId = transactionId;
		existedOrder.status = status;
		existedOrder.products = products;
		existedOrder.updatedAt = new Date();
		await existedOrder.save();

		return res.status(200).json(existedOrder);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const deleteOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { orderId } = req.params;
		if (!orderId)
			return res.status(400).json({ message: "OrderId is required." });

		const order = await Order.findOneAndDelete({ _id: orderId });
		if (!order)
			return res
				.status(404)
				.json({ message: `Order with id: ${orderId} does not exist.` });

		return res.status(200).json(order);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

const isOrder = (value: OrderType): value is OrderType => {
	return (
		"userId" in value &&
		"userEmail" in value &&
		"totalPrice" in value &&
		"products" in value &&
		"transactionDetails" in value &&
		"status" in value &&
		"transactionId" in value
	);
};
