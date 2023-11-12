import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../database/schema/user";
import { UserType } from "../types";

export const withAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token =
		req.body.token || req.query.token || req.headers["x-access-token"];
	if (!token) {
		return res
			.status(403)
			.json({ message: "A token is required for authentication" });
	}

	try {
		const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

		const user: UserType | null = await User.findOne({
			//@ts-ignore
			email: decodedUser.email,
		}).lean();

		req.user = user;
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(401).json({ message: "Invalid Token" });
	}

	return next();
};
