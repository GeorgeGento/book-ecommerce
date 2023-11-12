import { NextFunction, Request, Response } from "express";
import { uploadImageToCloud } from "../utils/cloudinary";
import { dataUri } from "../middleware/multer";

export const uploadImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.file)
			return res.status(400).json({ message: "Provide an image." });

		const file = dataUri(req).content;
		const imageUrl = await uploadImageToCloud(file!);
		return res.status(201).json({
			message: "Uploaded image.",
			imageUrl,
		});
	} catch (err) {
		req.app.locals.winston.error(err);

		return res.status(500).json({
			message: "Server error.",
			status: 500,
		});
	}
};
