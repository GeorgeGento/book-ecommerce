import { NextFunction, Request, Response } from "express";
import paypal from "@paypal/checkout-server-sdk";
import { Book } from "../database/schema/book";
import { Order } from "../database/schema/order";

export const createOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req;
		if (!req.body.items?.length)
			return res.status(409).json({ message: "Provide items." });

		const items = req.body.items.map((item: any) => ({
			_id: item._id,
			quantity: item.quantity,
		}));

		const productsId = items.map((p: any) => p._id);
		const products = await Book.find({ _id: { $in: productsId } }).lean();
		if (productsId.length !== products.length)
			return res.status(409).json({ message: "Invalid products detected." });

		let total = 0;
		const itemsToSend = [];
		for (const item of items) {
			const book = products.find((b) => b._id.toString() === item._id);
			if (!book)
				return res.status(409).json({ message: "Invalid products detected." });

			if (item.quantity > book.stock)
				return res
					.status(409)
					.json({ message: "Invalid product quantity detected." });

			const stock = book.stock - item.quantity;
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

			total += item.quantity * book.price;
			itemsToSend.push({
				name: book.title,
				unit_amount: {
					currency_code: "USD",
					value: book.price.toString(),
				},
				quantity: item.quantity,
				category: "PHYSICAL_GOODS",
			});
		}

		const Enviroment =
			process.env.NODE_ENVIRONMENT === "production"
				? paypal.core.LiveEnvironment
				: paypal.core.SandboxEnvironment;
		const paypalClient = new paypal.core.PayPalHttpClient(
			new Enviroment(
				process.env.PAYPAL_CLIENT_ID!,
				process.env.PAYPAL_CLIENT_SECRET!
			)
		);

		const paypalRequest = new paypal.orders.OrdersCreateRequest();
		paypalRequest.prefer("return=representation");

		paypalRequest.requestBody({
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "USD",
						value: total.toString(),
						breakdown: {
							item_total: {
								currency_code: "USD",
								value: total.toString(),
							},
							discount: {
								currency_code: "USD",
								value: "0.00",
							},
							handling: {
								currency_code: "USD",
								value: "0.00",
							},
							insurance: {
								currency_code: "USD",
								value: "0.00",
							},
							shipping_discount: {
								currency_code: "USD",
								value: "0.00",
							},
							shipping: {
								currency_code: "USD",
								value: "0.00",
							},
							tax_total: {
								currency_code: "USD",
								value: "0.00",
							},
						},
					},
					//@ts-ignore
					items: itemsToSend,
				},
			],
		});

		const order = await paypalClient.execute(paypalRequest);
		await Order.create({
			transactionId: order.result.id,
			userId: user?._id,
			userEmail: user?.email,
			totalPrice: total,
			products: items,
			status: order.result.status,
			transactionDetails: order.result,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return res.status(201).json({ id: order.result.id });
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const successfulOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { body } = req;
		if (!body) return res.status(400).json({ message: "Invalid Body." });

		const order = await Order.findOne({ transactionId: body.id });
		if (!order)
			return res.status(404).json({
				message: "Unknown order.",
			});

		order.status = body.status;
		order.transactionDetails = body;
		order.updatedAt = new Date();
		await order.save();

		return res.status(200).json({
			message: "Transaction completed.",
		});
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const cancelOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
		const { user } = req;
		if (!transactionId)
			return res.status(409).json({
				message: "Transaction ID is required.",
			});

		const order = await Order.findOneAndDelete({
			transactionId,
			userId: user?._id,
		});
		if (!order)
			return res.status(404).json({ message: "Unknown transaction." });

		return res.status(200).json({
			message: "Order canceled.",
		});
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};
