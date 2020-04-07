module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' });
  };
  // console.log('Require Login Module');
  next();
};
