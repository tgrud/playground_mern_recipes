import {useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'

export const Auth = () => {
  return (
    <div className="auth">
      <Login />
      <Register />
    </div>
  )
}

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // set the name of the cookie
  // we don't need the 1st arg so we assign it to "_"
  // grab the setCookies method out
  const [_, setCookies] = useCookies(["access_token"])

  // hook, function that will navigate you to whatever path you want
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()

    try {

      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password
      })

      // Set the cookie in the browser
      setCookies("access_token", response.data.token)
      // save user id in local storage
      window.localStorage.setItem("userID", response.data.userID)
      // redirect to home page (useNavigate -> react-router-dom)
      navigate("/")

    } catch(err) {

    }
  }

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  )
}

const Register = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Async function
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      //  Grab from Insomnia calls we were doing before
      //  first argument is URL
      // second url is the json we want to send through
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password
      })

      alert("Registration Complete! Now login")
    }

    catch(err) {
      console.error(err)
    }
  }

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit={onSubmit}
    />
  )
}



const Form = ({username, setUsername, password, setPassword, label, onSubmit}) => {
  return (
    <div className="auth-container">
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input value={username} type="text" id="username" onChange={(event)=> setUsername(event.target.value)}></input>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input value={password} type="password" id="password" onChange={(event)=> setPassword(event.target.value)}></input>
        </div>
        <button type='submit'> {label}</button>
      </form>
    </div>
  )
}