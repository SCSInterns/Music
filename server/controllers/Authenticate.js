const jwt = require('jsonwebtoken'); 

const authenticatetoken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token == null) {
        return res.status(401).json({ msg: 'Token is missing ' })
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            return res.status(403).json({ msg: 'Invalid Token' })
        }

        req.user = user;
        next();
    })

}


module.exports = {
   authenticatetoken
};