import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import "dotenv/config";
import * as types from "./src/types";
import { connect } from "./src/database";
import Routes from "./src/routes";
import Morgan from "./src/utils/loggers/morgan";
import Winston from "./src/utils/loggers/winston";

const app = express();
const customMorgan = new Morgan();

// Morgan Logging
app.use(
	morgan("combined", {
		stream: customMorgan.get,
		skip: (req, res) => {
			return req.method !== "GET";
		},
	})
);
app.use(
	morgan("combined", {
		stream: customMorgan.post,
		skip: (req, res) => {
			return req.method !== "POST";
		},
	})
);
app.use(
	morgan("combined", {
		stream: customMorgan.patch,
		skip: (req, res) => {
			return req.method !== "PATCH";
		},
	})
);
app.use(
	morgan("combined", {
		stream: customMorgan.delete,
		skip: (req, res) => {
			return req.method !== "DELETE";
		},
	})
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
connect();

//Winston logger
app.locals.winston = new Winston();

app.use("/", Routes);

app.listen(process.env.PORT!, () => {
	console.log(`Listening on port ${process.env.PORT!}`);
});

process
	.on("uncaughtException", (err) => console.error(err))
	.on("unhandledRejection", (err) => console.error(err));
