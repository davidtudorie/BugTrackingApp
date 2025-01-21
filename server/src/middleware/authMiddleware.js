const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: require('../models').Project, as: 'Projects' }],
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ 
      error: 'Invalid token.' 
    });
  }
};

module.exports = { authenticateToken };