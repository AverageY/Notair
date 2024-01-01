const isLoggedin = (req, res, next) => {
    if(req.user) {
        next();
      } else {
        return res.status(401).send('Access Denied');
      }
}

module.exports = isLoggedin;