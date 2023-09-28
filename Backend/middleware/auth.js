const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.APPTOKEN;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decodedToken = jwt.verify(token, key);
    const userId = decodedToken.userId;

    req.auth = {
      userId: userId,//requete d'autorisation basée sur le décodage du token lié à l'utilisateur demandé
    };
    if (req.body.userId && req.body.userId !== userId) {
      throw "user invalide";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
