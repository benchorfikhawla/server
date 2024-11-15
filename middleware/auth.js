 
module.exports = function(req, res, next) {
    // Your authentication logic here
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).send('Unauthorized');
    }
  };
  // middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extrait le token de l'en-tête

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Stocke l'utilisateur dans la requête
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = protect;

  