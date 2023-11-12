import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../database/schema/user";

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { firstName, lastName, email, password, age, phoneNumber } =
			req.body;

		if (
			!(email && password && firstName && lastName && age && phoneNumber)
		) {
			return res.status(400).json({ message: "All input is required" });
		}

		const oldUser = await User.findOne({ email });
		if (oldUser) {
			return res
				.status(409)
				.json({ message: "User Already Exist. Please Login" });
		}

		//Encrypt user password
		const encryptedPassword = await bcrypt.hash(password, 10);

		// Create user in our database
		const user = await User.create({
			firstName,
			lastName,
			email: email.toLowerCase(), // sanitize: convert email to lowercase
			password: encryptedPassword,
			age,
			phoneNumber,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Create token
		const token = jwt.sign(
			{ id: user._id, email },
			process.env.ACCESS_TOKEN_SECRET!,
			{
				expiresIn: "7d",
			}
		);

		// return new user
		res.status(201).json({ accessToken: token });
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
			return res.status(400).json({ message: "All input is required" });
		}

		// Validate if user exist in our database
		const user = await User.findOne({ email });
		if (user && (await bcrypt.compare(password, user.password))) {
			// Create token
			const token = jwt.sign(
				{ userId: user._id, email },
				process.env.ACCESS_TOKEN_SECRET!,
				{
					expiresIn: "7d",
				}
			);

			return res.status(200).json({ accessToken: token, _id: user._id });
		}

		return res.status(400).json({ message: "Invalid Credentials" });
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};
