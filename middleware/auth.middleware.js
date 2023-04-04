const User = require('../models/user.model')

exports.isAdmin = (req, res, next) => {
    if (!(req.user.role === 1)) {
      return res.status(403).json({
        success: false,
        err: "YOU ARE NOT ADMIN",
      });
    }
    next();
  };