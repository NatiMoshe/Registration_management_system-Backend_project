const mongoose = require("mongoose");
const { Schema } = mongoose;

//the user must contain id,firstname,lastname.
//the report data will be added by adding costs data to user
const userSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
			minlength: 9,
			maxlength: 9,
		},

		firstName: {
			type: String,
			required: true,
		},

		lastName: {
			type: String,
			required: true,
		},

		reportsData: [
			{
				year: Number,
				sum: Number,
				costsInfo: [
					{
						description: String,
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
						},
						sum: Number,
					},
				],
			},
		],
	},

	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
