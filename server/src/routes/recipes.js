import express from "express"
import mongoose from "mongoose"
//  NOTE: need .js even when ide does not include it
import { RecipeModel } from "../models/Recipes.js"
import { UserModel } from "../models/Users.js"
import { verifyToken } from "./users.js"

const router = express.Router()

// We want to list the recipes all on the home page ("/")
router.get("/", async (req, res) => {
  try {
    // find({...}) usually contains parameters, but since we want all we use an empty object
    const response = await RecipeModel.find({})
    res.json(response)
  } catch(err) {
    res.json(err)
  }
})

router.post("/", verifyToken, async (req, res) => {
  // This works but what w use is shorthand
  // const recipe = new RecipeModel({
  //   ...req.body
  // })
  const recipe = new RecipeModel(req.body)
  try {
    // find({...}) usually contains parameters, but since we want all we use an empty object
    const response = await recipe.save()
    res.json(response)
  } catch(err) {
    res.json(err)
  }
})

// create a saved recipe for a user
router.put("/", verifyToken, async (req, res) => {
  try {
    // find the recipe by id
    const recipe = await RecipeModel.findById(req.body.recipeID)
    // find the user by id
    const user = await UserModel.findById(req.body.userID)
    // dealing with objects so we push into this objects array
    user.savedRecipes.push(recipe)
    // commit the save
    await user.save()
    // respond with the saved recipe(s)
    res.json({savedRecipes: user.savedRecipes })
  } catch(err) {
    res.json(err)
  }
})

// grab a user's saved recipe(s) ids
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {

    // Grab the user by id
    const user = await UserModel.findById(req.params.userID)
    // return only the saved recipes (only if the savedRecipes exists)
    res.json({ savedRecipes: user?.savedRecipes })
  } catch(err) {
    res.json(err)
  }
})

// grab the recipes off of a user
router.get("/savedRecipes/:userID", async (req, res) => {
  try {

    // Grab the user by id
    const user = await UserModel.findById(req.params.userID)
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    })

    res.json({ savedRecipes })
  } catch(err) {
    res.json(err)
  }
})



export { router as recipesRouter }
