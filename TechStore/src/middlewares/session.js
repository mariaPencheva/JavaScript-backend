const { verifyToken } = require("../services/jwt");

function session() {
    return function(req, res, next) {
        const token = req.cookies?.token;

        if(token) {
            try {
                const sessionData = verifyToken(token);
                req.user = {
                    name: sessionData.name,
                    email: sessionData.email,
                    _id: sessionData._id
                };
                res.locals.hasUser = true;
                
            } catch(err) {
                res.clearCookie('token');
                req.user = null;
            }
        }

        next();
    };
}

module.exports = { session };