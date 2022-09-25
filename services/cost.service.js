const Cost = require("../models/cost");
const User = require("../models/user");

module.exports = {
	//This method create new cost for user only if this user exist
	async insertCost(description, category, year, month, sum, userId) {
		const user = await User.findOne({ id: userId });
		if (!user) {
			console.log(`user with id:${id} not found`);
			return;
		}
		const newCost = await Cost.create({
			description,
			category,
			year,
			month,
			sum,
		});

		return newCost;
	},
};
