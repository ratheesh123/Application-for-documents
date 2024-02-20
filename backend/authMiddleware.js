
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming the token includes a 'userId' field
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = authenticate;

