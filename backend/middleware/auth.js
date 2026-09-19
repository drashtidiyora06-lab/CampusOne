import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'campusone_jwt_secret_dev_key_2026';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
};


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    let allowed = false;

    if (userRole) {
      if (roles.includes(userRole)) allowed = true;
      if (roles.includes('faculty') && userRole === 'teacher') allowed = true;
      if (roles.includes('teacher') && userRole === 'faculty') allowed = true;
    }

    if (!req.user || !allowed) {
      return res.status(403).json({
        success: false,
        message: `Role (${userRole || 'guest'}) is not allowed to access this resource`
      });
    }
    next();
  };
};
