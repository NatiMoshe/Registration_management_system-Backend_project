const User = require("../models/user");

module.exports = {
	// This mathod updates exist user, if user not found it creates a new user
	async createOrUpdateUser(id, firstName, lastName) {
		const newUser = await User.findOneAndUpdate(
			{ id },
			{ firstName, lastName},
			{ runValidators: true, upsert: true, new: true }
		);
		return newUser;
	},

	//This method insert cost to user with the computed Design Pattern.
	//inserting cost to user based on month and year
	async reportUserUpdate(newCost, id) {
		const user = await User.findOne({ id });
		if (!user) {
			console.log(`user with id:${id} not found`);
			return;
		}

		const yearIndex = user.reportsData.findIndex(
			(element) => element.year === newCost.year
		);

		if (yearIndex === -1) {
			user.reportsData.push({
				year: newCost.year,
				sum: newCost.sum,
				months: {
					sum: newCost.sum,
					name: newCost.month,
					costsInfo: [
						{
							description: newCost.description,
							category: newCost.category,
							sum: newCost.sum,
						},
					],
				},
			});

			const updatedUser = await User.findOneAndUpdate(
				{ id },
				{ reportsData: user.reportsData },
				{ runValidators: true, new: true }
			);
			return updatedUser;
		}

		if (yearIndex >= 0) {
			const monthIndex = user.reportsData[yearIndex].months.findIndex(
				(element) => element.name === newCost.month
			);

			if (monthIndex === -1) {
				user.reportsData[yearIndex].months.push({
					sum: newCost.sum,
					name: newCost.month,
					costsInfo: [
						{
							description: newCost.description,
							category: newCost.category,
							sum: newCost.sum,
						},
					],
				});
				user.reportsData[yearIndex].sum += newCost.sum;

				const updatedUser = await User.findOneAndUpdate(
					{ id },
					{ reportsData: user.reportsData },
					{ runValidators: true, new: true }
				);
				return updatedUser;
			}

			if (monthIndex >= 0) {
				user.reportsData[yearIndex].months[monthIndex].costsInfo.push({
					description: newCost.description,
					category: newCost.category,
					sum: newCost.sum,
				});
				user.reportsData[yearIndex].months[monthIndex].sum += newCost.sum;
				user.reportsData[yearIndex].sum += newCost.sum;

				const updatedUser = await User.findOneAndUpdate(
					{ id },
					{ reportsData: user.reportsData },
					{ runValidators: true, new: true }
				);
				return updatedUser;
			}
		}
	},
	//this method return report of the user cost for a specific month and year
	async generateMonthlyReport(id, year, month) {
		return User.aggregate([
			{
				$match: { id },
			},
			{
				$unwind: "$reportsData",
			},
			{
				$match: { "reportsData.year": year },
			},
			{
				$unwind: "$reportsData.months",
			},
			{
				$match: { "reportsData.months.name": month },
			},
			{
				$project: {
					id: 1,
					firstName: 1,
					lastName: 1,
					year: "$reportsData.year",
					month: "$reportsData.months.name",
					sum: "$reportsData.months.sum",
					costs: "$reportsData.months.costsInfo",
				},
			},
		]);
	},
};
