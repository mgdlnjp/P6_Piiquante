const express = require("express");
const mongoose = require("mongoose");

require('dotenv').config();

const sqlUser = process.env.SQL_USER;
const sqlPassword = process.env.SQL_PASSWORD;

const userRoutes = require("./routes/user");

const bd = "mongodb+srv://" + sqlUser + ":" + sqlPassword + "@cluster0.ykcu8qz.mongodb.net/?retryWrites=true&w=majority"

mongoose
  .connect(
    //console.log("mongodb+srv://" + sqlUser + ":" + sqlPassword + "@cluster0.ykcu8qz.mongodb.net/?retryWrites=true&w=majority"),
    //"mongodb+srv://magdeleinejpierre:Openclassrooms@cluster0.ykcu8qz.mongodb.net/?retryWrites=true&w=majority",
    bd,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());

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

  /*   console.log("CROS");
   */
  next();
});

/* app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
}); */

/* app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
}); */

/* app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
}); */


app.use("/api/auth", userRoutes);

module.exports = app;
