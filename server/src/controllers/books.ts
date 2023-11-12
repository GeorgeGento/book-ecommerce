import { NextFunction, Request, Response } from "express";
import { Book } from "../database/schema/book";
import { BookType } from "../types";
import bookCategories from "../contants/bookCategories.json";

export const getBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skip, limit } = req.query;
		let currentSkip = skip ? parseInt(skip as string) : 0;
		let currentLimit = limit ? parseInt(limit as string) : 15;
		currentLimit = currentLimit < 1 ? 15 : currentLimit;

		let result = await Book.aggregate([
			{
				$match: {},
			},
			{
				$facet: {
					metaData: [{ $count: "totalBooks" }],
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

export const getBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId } = req.params;
		if (!bookId)
			return res.status(400).json({ message: "bookId is required." });

		const book = await Book.findOne({ _id: bookId });
		if (!book)
			return res
				.status(404)
				.json({ message: `Book with id: ${bookId} does not exist.` });

		return res.status(200).json(book);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const getBookCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		//const categories = await Book.find().distinct("tags");
		return res.status(200).json(bookCategories);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const getBooksByCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skip, limit } = req.query;
		const { category } = req.params;
		if (!category)
			return res.status(400).json({ message: "Category is required." });

		let currentSkip = skip ? parseInt(skip as string) : 0;
		let currentLimit = limit ? parseInt(limit as string) : 15;
		currentLimit = currentLimit < 1 ? 15 : currentLimit;

		let result = await Book.aggregate([
			{
				$match: {
					tags: {
						$in: [category],
					},
				},
			},
			{
				$facet: {
					metaData: [{ $count: "totalBooks" }],
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

export const postBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const bookBody = req.body;
		if (!isBook(bookBody))
			return res.status(400).json({ message: "All fields required." });

		const {
			title,
			description,
			tags,
			imageUrl,
			author,
			price,
			stock,
			publisher,
		} = bookBody;
		const existedBook = await Book.findOne({ title, author });
		if (existedBook)
			return res.status(409).json({
				message: "Book already exists.",
			});

		const newBook = await Book.create({
			title,
			description,
			tags,
			imageUrl,
			author,
			price,
			stock,
			inventoryStatus:
				stock <= 0 ? "OUT_OF_STOCK" : stock > 20 ? "HIGH_STOCK" : "LOW_STOCK",
			publisher,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return res.status(201).json(newBook);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const patchBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId } = req.params;
		if (!bookId)
			return res.status(400).json({ message: "bookId is required." });

		const bookBody = req.body;
		if (!isBook(bookBody))
			return res.status(400).json({ message: "All fields required." });

		const {
			title,
			description,
			tags,
			imageUrl,
			author,
			price,
			stock,
			publisher,
		} = bookBody;
		const existedBook = await Book.findOne({ _id: bookId });
		if (!existedBook)
			return res.status(404).json({
				message: `Book with id: ${bookId} not found.`,
			});

		existedBook.title = title;
		existedBook.description = description;
		existedBook.tags = tags;
		existedBook.imageUrl = imageUrl;
		existedBook.author = author;
		existedBook.price = price;
		existedBook.inventoryStatus =
			stock <= 0 ? "OUT_OF_STOCK" : stock > 20 ? "HIGH_STOCK" : "LOW_STOCK";
		existedBook.stock = stock;
		existedBook.publisher = publisher;
		existedBook.updatedAt = new Date();
		await existedBook.save();

		return res.status(200).json(existedBook);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const deleteBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId } = req.params;
		if (!bookId)
			return res.status(400).json({ message: "bookId is required." });

		const book = await Book.findOneAndDelete({ _id: bookId });
		if (!book)
			return res
				.status(404)
				.json({ message: `Book with id: ${bookId} does not exist.` });

		return res.status(200).json(book);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

const isBook = (value: BookType): value is BookType => {
	return (
		"title" in value &&
		"description" in value &&
		"author" in value &&
		"price" in value &&
		"tags" in value
	);
};
