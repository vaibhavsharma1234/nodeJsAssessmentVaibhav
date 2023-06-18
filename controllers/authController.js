const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Snowflake } = require('@theinternetfolks/snowflake')
const authModel = require('../models/authModel')
const tokenExpiration = '1h'
const signup = async (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const hashedPassword = await bcrypt.hash(password, 10)
  const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: tokenExpiration,
  })
  const emailExist = await authModel.findOne({ email })

  // check if email already exists
  if (emailExist) {
    res.status(400)
    throw new Error('Email already exists')
  }
  const user = new authModel({
    id: Snowflake.generate(),
    name,
    email,
    password: hashedPassword,
  })
  await user.save()
  if (user) {
    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
      meta: {
        access_token: accessToken,
      },
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
}
const signin = async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await authModel.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('user does not exist')
  }
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: tokenExpiration,
    })
    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
      meta: {
        access_token: accessToken,
      },
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
}
const currUser = async (req, res) => {
  const currrentUser = req.user
  const email = currrentUser.email
  const user = await authModel.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('user does not exist')
  }
  res.status(200).json({
    status: true,
    content: {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.createdAt,
      },
    },
  })
}
module.exports = { signup, signin, currUser }
