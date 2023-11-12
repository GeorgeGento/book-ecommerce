import { Request } from "express";
import multer from "multer";
import DatauriParser from "datauri/parser";
import path from "path";

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");
const dUri = new DatauriParser();

const dataUri = (req: Request) =>
	dUri.format(
		path.extname(req.file.originalname).toString(),
		req.file.buffer
	);
export { multerUploads, dataUri };
