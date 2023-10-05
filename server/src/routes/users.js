import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'

const router = express.Router()

// express async callbacks have at least 2 arguments, req and res)
router.post("/register", async (req, res) => {
  const { username, password } = req.body

  // can be findOne({username: username})
  const user = await UserModel.findOne({username})

  if(user) {
    return res.json({message: "User already exists!"})
  }

  // Hash the password, 10 is the default #
  const hashedPassword = await bcrypt.hash(password, 10)

  // How you use Mongoose to create a user document entry
  const newUser = new UserModel({ username, password: hashedPassword })
  // insert with mongoose
  await newUser.save()

  res.json({message: "User Registered successfully!"})

})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  // Grab user. If exists, it will be in this var
  const user = await UserModel.findOne({username})

  if(!user) {
    return res.json({ message: "User Doesn't Exist!"})
  }

  // used to compare the hashed results (in db) with hashing the password provided
  const isPasswordValid = await bcrypt.compare(password, user.password)

  // if passwords do not match
  if(!isPasswordValid) {
    return res.json({ message: "Username or password is incorrect" })
  }

  // If we got here, user exists, and password matches
  //
  // create a token with the users id
  // "secret should be off NOT in the code like this for production"
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token, userID: user._id })
})

export { router as userRouter }

// Middleware
// Access to next() to move things forward if all good
export const verifyToken = (req, res, next) => {
  // Grab token
  const token = req.headers.authorization
  // If there is one
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      // if there is an err with jwt.verify, return 403
      if(err) return res.sendStatus(403)
      // No error, token checks out, call next() to move forward
      next()
    })
  // No token
  } else {
    // this returns the status, next() is not called
    res.sendStatus(401)
  }
}