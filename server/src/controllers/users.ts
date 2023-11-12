import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";

import { User } from "../database/schema/user";
import { UserType } from "../types";

export const getUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { skip, limit, admin } = req.query;
		let currentSkip = skip ? parseInt(skip as string) : 0;
		let currentLimit = limit ? parseInt(limit as string) : 15;
		currentLimit = currentLimit < 1 ? 15 : currentLimit;

		let result = await User.aggregate([
			{
				$match: {},
			},
			{
				$facet: {
					metaData: [{ $count: "totalUsers" }],
					data: [{ $skip: currentSkip }, { $limit: currentLimit }],
				},
			},
		]);

		result = result[0];
		const data = {
			//@ts-ignore
			metadata: { ...result.metaData[0], count: result.data.length },
			//@ts-ignore
			data: result.data.map((user) =>
				_.pick(
					user,
					"_id",
					"firstName",
					"lastName",
					"email",
					"verifiedEmail",
					"phoneNumber",
					"age",
					"admin",
					"createdAt",
					"updatedAt"
				)
			),
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

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		return res
			.status(200)
			.json(
				_.pick(
					req.user,
					"_id",
					"firstName",
					"lastName",
					"email",
					"verifiedEmail",
					"phoneNumber",
					"age",
					"admin",
					"createdAt",
					"updatedAt"
				)
			);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const postUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { firstName, lastName, email, password, admin, age, phoneNumber } =
			req.body;

		if (
			!(email && password && firstName && lastName && age && phoneNumber)
		) {
			return res.status(400).json({ message: "All input is required." });
		}

		const oldUser = await User.findOne({ email });
		if (oldUser) {
			return res.status(409).json({ message: "User Already Exist." });
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			firstName,
			lastName,
			email: email.toLowerCase(),
			password: encryptedPassword,
			admin: admin || false,
			age,
			phoneNumber,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const token = jwt.sign(
			{ _id: user._id, email },
			process.env.ACCESS_TOKEN_SECRET!,
			{
				expiresIn: "7d",
			}
		);

		return res.status(201).json({ ...user, accessToken: token });
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const patchUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		if (!userId)
			return res.status(400).json({ message: "userId is required." });
		const {
			_id,
			firstName,
			lastName,
			email,
			password,
			admin,
			age,
			phoneNumber,
		} = req.body;
		if (!isUser(req.body))
			return res.status(400).json({ message: "Invalid user." });

		const user = await User.findOne({ _id: userId });
		if (!user)
			return res
				.status(404)
				.json({ message: `User with id: ${userId} does not exist.` });

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (email) user.email = email;
		if (password) user.password = await bcrypt.hash(password, 10);
		if (age) user.age = age;
		if (phoneNumber) user.phoneNumber = phoneNumber;

		user.admin = admin ? (admin === true ? true : false) : user.admin;
		user.updatedAt = new Date();
		await user.save();

		return res.status(201).json(user);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;
		if (!userId)
			return res.status(400).json({ message: "userId is required." });

		if (userId === req.user?._id)
			return res.status(403).json({ message: "Cannot delete yourself." });

		const user = await User.findOne({ _id: userId });
		if (!user)
			return res
				.status(404)
				.json({ message: `User with id: ${userId} does not exist.` });

		if (user.admin)
			return res.status(409).json({ message: `Cannot delete an admin.` });

		await User.findOneAndDelete({ _id: userId });

		return res.status(200).json(user);
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

const isUser = (value: UserType): value is UserType => {
	return "_id" in value;
};
