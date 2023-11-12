import { Router } from "express";
import { uploadImage } from "../controllers/upload";
import { multerUploads } from "../middleware/multer";

const UploadRoutes = Router();

UploadRoutes.post("/image", multerUploads, uploadImage);

export default UploadRoutes;
