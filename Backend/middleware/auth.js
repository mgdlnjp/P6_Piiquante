const jwt = require('jsonwebtoken');

require('dotenv').config();
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       console.log(token);

       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       console.log(decodedToken);

       const userId = decodedToken.userId;
       console.log(userId);

       req.auth = {
           userId: userId
       };
       if (req.body.userId && req.body.userId !== userId) {
        throw "user invalide"; 
      } else {
        next(); 
      }
   } catch(error) {
       res.status(401).json({ error });
   }
};