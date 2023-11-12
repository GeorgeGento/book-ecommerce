import { Snowflake } from "nodejs-snowflake";

export const generateShowflakeId = () => {
	const generator = new Snowflake({
		custom_epoch: (2023 - 1970) * 31536000 * 1000,
		instance_id: 3123,
	});

	return `${generator.getUniqueID()}`;
};
