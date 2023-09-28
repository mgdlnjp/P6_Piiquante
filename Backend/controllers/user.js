const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const key = process.env.APPTOKEN;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //cryptage des données au moment de la création d' l'utilisateur
    .then((hash) => {
      const user = new User({//propriété demandées a l'utilisateur pour sa création
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })//requete de l'email de l'utilisateur demandé
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)//comparaison du password avec celui de l'utilisateur 
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,//récuperation du l'id de l'utilisateur
            token: jwt.sign({ userId: user._id }, key, { expiresIn: "24h" }), //creation du token utilisateur au moment de la connexion
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
