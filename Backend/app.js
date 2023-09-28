const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const sqlUser = process.env.SQL_USER;
const sqlPassword = process.env.SQL_PASSWORD;
const path = require("path");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

const db = //lien vers la base de donnée Mongoose de l'utilisateur
  "mongodb+srv://" +
  sqlUser +
  ":" +
  sqlPassword +
  "@cluster0.ykcu8qz.mongodb.net/Piiquantes?retryWrites=true&w=majority";

// connexion au Mongoose de l'utilisateur
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// connexion EXPRESS
const app = express();
app.use(express.json());

//passerelle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//origin link des Routes
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
