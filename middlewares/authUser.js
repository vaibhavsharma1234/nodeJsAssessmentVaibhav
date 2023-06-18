const jwt = require('jsonwebtoken')
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Access token not found' })
  }

  // Verify the token using JWT
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    // Set the current user on the request object
    req.user = decoded

    // Proceed to the next middleware or route handler
    next()
  })
}

module.exports = authenticateToken
