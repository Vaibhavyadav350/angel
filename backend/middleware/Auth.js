const catchAsyncErrors = require('./CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

exports.checkUserAuthentication = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    console.warn(`[AUTH DENIED] No token provided for ${req.method} ${req.originalUrl}`);
    return next(
      new ErrorHandler('Please login again to access this resource', 401)
    );
  }
  const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await Admin.findById(decodedData.id);
  if (!user) {
    console.warn(`[AUTH DENIED] Token valid but user not found in DB for ${req.method} ${req.originalUrl}`);
    return next(new ErrorHandler('User not found', 401));
  }
  req.user = user;
  next();
});

exports.isAuthenticatedAdmin = exports.checkUserAuthentication; // Alias for compatibility

exports.checkAdminPrivileges = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.privilege)) {
      console.warn(`[AUTH PRIVILEGE DENIED] Admin '${req.user.email}' (role: ${req.user.privilege}) blocked from ${req.method} ${req.originalUrl}. Required: ${roles.join('/')}`);
      return next(
        new ErrorHandler(
          `Role: ${req.user.privilege} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
