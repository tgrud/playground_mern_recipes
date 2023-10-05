import * as dotenv from 'dotenv'
dotenv.config()
// express ins for API
// serves our front end
import express from 'express'

// allows you to set up rules for front and backend
// without this, you will get an error when trying
//  to have your front end contact the backend
import cors from 'cors'

// ORM for mongoDB
// allows us to write queries, etc to our DB
import mongoose from 'mongoose'

// routes for auth and login
import { userRouter } from './routes/users.js'
import { recipesRouter } from './routes/recipes.js'

// Generate a version of our API
const app = express()

// Middlewares
//
// send data from the front end, convert it to json
// Without this, getting data from the front end is not simple
app.use(express.json())
//
// Ability to make request from front end to backend
app.use(cors())

// for authentication, we will use the userRouter
app.use("/auth", userRouter)
app.use("/recipes", recipesRouter)

// TODO: move to .env var
mongoose.connect(
  process.env.MONGOOSE_CONNECT
)

// Port to listen on
// When server starts up, we return a callback, here we will log a message
app.listen(3001, () => console.log("SERVER STARTED"))



