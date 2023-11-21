import { RotatingFileStream, createStream } from "rotating-file-stream";
import { resolve, join } from "path";

import Winston from "./winston";

const winston = new Winston();
const pad = (num: number) => (num > 9 ? "" : "0") + num;
const generator = (time: any, index: number | undefined) => {
	if (!time) return "file.log";

	const year = time.getYear() + 1900;
	const month = pad(time.getMonth() + 1);
	const day = pad(time.getDate());

	return `${month}-${year}/${day}-file-${index}.log`;
};

const createLogger = (path: string) => {
	try {
		const logger = createStream(generator, {
			size: "10M",
			interval: "1d", // rotate daily
			initialRotation: true,
			path: join(resolve(), path),
		});

		logger.on("error", (err) => winston.error(err));
		logger.on("warning", (warm) => winston.info(warm));

		return logger;
	} catch (err) {
		console.error(err);
	}
};

export default class Morgan {
	get: RotatingFileStream;
	post: RotatingFileStream;
	patch: RotatingFileStream;
	delete: RotatingFileStream;
	constructor() {
		//@ts-ignore
		this.get = createLogger("/logs/morgan/get");
		//@ts-ignore
		this.post = createLogger("/logs/morgan/post");
		//@ts-ignore
		this.patch = createLogger("/logs/morgan/patch");
		//@ts-ignore
		this.delete = createLogger("/logs/morgan/delete");
	}
}
