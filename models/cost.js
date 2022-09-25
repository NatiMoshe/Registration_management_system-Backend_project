const mongoose = require("mongoose");

//the cost must contain desription,category,year,month and sum
const costSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},

		category: {
			type: String,
			enum: [
				"food",
				"health",
				"sport",
				"housing",
				"transportation",
				"education",
			],
			required: true,
		},

		sum: {
			type: Number,
			required: true,
		},
	},
	
	{ timestamps: true }
);

const Cost = mongoose.model("Cost", costSchema);

module.exports = Cost;
