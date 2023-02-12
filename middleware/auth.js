const jwt = require('jsonwebtoken')
  
module.exports = (req, res, next) => {
    try {
      //extraire le token du header authorization
      const header = req.header("Authorization");
      if (!header) {
        return res.status(401).json({ error: "Authorization header missing" });
      }
      //on utilise split pour récupérer le code après Bearer
      const token = header.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Token missing in Authorization header" });
      }
      //décoder le token pour récupérer le userID et l'ajouter à l'objet request
      const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
      const userId = decodedToken.userId
      req.auth = {
        userId: userId
      };
      if(req.body.userId && req.body.userId !== userId){
        throw "invalid userId"
      }else{
        next();
      }
    } catch (error) {
      res.status(401).json({ error });
    }
  }
  
  
  
  