import { Routes, Route } from "react-router-dom"
import Profile from "./pages/Profile"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import './App.css'
import Social from "./pages/Social"

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/social-login' element={<Social />} />
      </Routes>
    </div>
  )
}

export default App
