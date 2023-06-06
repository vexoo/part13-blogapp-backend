const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session } = require("../models");

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors[0].message })
  } else if (error.name === 'TypeError') {
    return response.status(500).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  const session = await Session.findByPk(authorization.substring(7))
  if (!session) {
		return res.status(401).json({ error: 'No session found, login required' })
  }
  next()
}

module.exports = { errorHandler, tokenExtractor }
