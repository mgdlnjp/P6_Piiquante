const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({//propriéte du schéma de l'utilisateur pour Mongoose
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//initialisation des propriétes 'uniques' de l'utilisateur pour Mongoose
userSchema.plugin(uniqueValidator);

//Exportation de ces propriétés pour Mongoose
module.exports = mongoose.model("User", userSchema);
