var express = require("express");
const { body, validationResult } = require("express-validator");
const costService = require("../services/cost.service");
const userService = require("../services/user.service");

const router = express.Router();

//Insert new cost to DB with the require validatos

router.post(
	"/insert",
	body("description").exists().isString(),
	body("category").exists().isString(),
	body("year").exists().isNumeric(),
	body("month")
		.exists()
		.isNumeric()
		.isIn([
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		]),
	body("sum").isNumeric(),
	body("userId").isString().isLength({ min: 9, max: 9 }),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { description, category, year, month, sum, userId } = req.body;

		const newCost = await costService.insertCost(
			description,
			category,
			year,
			month,
			sum,
			userId
		);
		await userService.reportUserUpdate(newCost, userId);

		res.status(200).send();
	}
);

module.exports = router;
