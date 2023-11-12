import { NextFunction, Request, Response } from "express";

export const isAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req;
		if (!user || !user.admin) {
			return res.status(401).json({ message: "Unauthorized Access." });
		}

		next();
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(401).json({ message: "Unauthorized Access." });
	}
};

export const isAdminOrOwner = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { user } = req;
		const { userId } = req.params;
		if (!user)
			return res.status(401).json({ message: "Unauthorized Access." });

		if ((userId && userId === user._id.toString()) || user.admin) {
			return next();
		}

		return res.status(401).json({ message: "Unauthorized Access." });
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(401).json({ message: "Unauthorized Access." });
	}
};
