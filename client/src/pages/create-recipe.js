import React, {useState} from 'react'
import axios from 'axios'
import { useGetUserID } from '../hooks/useGetUserID.js'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

export const CreateRecipe = () => {

  const [cookies] = useCookies(["access_token"])
  const userID = useGetUserID()

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageURL: "",
    cookingTime: 0,
    userOwner: userID
  })

  const navigate = useNavigate()


  const handleChange = (event) => {
    const { name, value } = event.target
    setRecipe({...recipe, [name]: value})
  }

  const addIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]})
  }

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target
    const ingredients = recipe.ingredients
    ingredients[idx] = value
    // can do short hand if you want
    setRecipe({...recipe, ingredients: ingredients})
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      console.log(recipe)
      await axios.post(
        "http://localhost:3001/recipes",
        recipe,
        { headers: { authorization: cookies.access_token }}
      )
      alert("Recipe created")
      navigate("/")
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={onSubmit}>

        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" onChange={handleChange}/>

        <label htmlFor="ingredients">Ingredients</label>
        {/* Need this to by type button, button in a form, don't want to submit the form with this */}
        <button onClick={addIngredient} type="button">Add Ingredient</button>
        { recipe.ingredients.map( (ingredient, idx) => (
          <input
            key={idx}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, idx)}
          ></input>
        ))}

        <label htmlFor="instructions">Instructions</label>
        <textarea id="instructions" name="instructions" onChange={handleChange} ></textarea>

        <label htmlFor="imageURL">Image URL</label>
        <input type="text" id="imageURL" name="imageURL" onChange={handleChange} />

        <label htmlFor="cookingTime">Cooking Time (minutes)</label>
        <input type="number" id="cookingTime" name="cookingTime" onChange={handleChange} />

        {/* This button will submit the form */}
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  )
}