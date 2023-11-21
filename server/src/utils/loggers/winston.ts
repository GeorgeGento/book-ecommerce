import { resolve, join } from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
const { combine, timestamp, label, printf } = format;

const dirPath = join(resolve(), `/logs/winston`);

class Winston {
	format: any;
	constructor() {
		this.format = printf(({ level, message, stack, timestamp }) => {
			return `${Array(100).fill("-").join("")} \n ${level}: ${timestamp} \n ${
				stack ? stack : message
			}`;
		});
	}

	createLog() {
		return createLogger({
			format: combine(timestamp(), this.format),
		});
	}

	error(err: any) {
		try {
			const logger = this.createLog();
			const date = new Date();
			logger.add(
				new transports.DailyRotateFile({
					filename: `${dirPath}/errors/${
						date.getMonth() + 1
					}-${date.getFullYear()}/%DATE%.log`,
					datePattern: "DD-MM-YYYY",
					maxSize: "20m",
					level: "error",
				})
			);

			return logger.error(err);
		} catch (err) {
			console.error(err);
		}
	}

	info(info: any) {
		try {
			const logger = this.createLog();
			const date = new Date();
			logger.add(
				new transports.DailyRotateFile({
					filename: `${dirPath}/info/${
						date.getMonth() + 1
					}-${date.getFullYear()}/%DATE%.log`,
					datePattern: "DD-MM-YYYY",
					maxSize: "20m",
					level: "info",
				})
			);

			return logger.info(info);
		} catch (err) {
			console.error(err);
		}
	}

	debug(err: any) {
		try {
			const logger = this.createLog();
			const date = new Date();
			logger.add(
				new transports.DailyRotateFile({
					filename: `${dirPath}/debug/${
						date.getMonth() + 1
					}-${date.getFullYear()}/%DATE%.log`,
					datePattern: "DD-MM-YYYY",
					maxSize: "20m",
					level: "debug",
				})
			);

			return logger.debug(err);
		} catch (err) {
			console.error(err);
		}
	}
}

export default Winston;
