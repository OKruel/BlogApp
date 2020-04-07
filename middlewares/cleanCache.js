const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    await next();
    console.log('Clear Hash Module');
    clearHash(req.user.id);
};