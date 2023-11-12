import { v2 as cloudinary } from "cloudinary";

const uploadImageToCloud = async (image: string) => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		secure: true,
	});

	const res = await cloudinary.uploader.upload(image);
	if (!res) return null;

	return res.secure_url;
};

export { uploadImageToCloud };
