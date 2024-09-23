import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from '../MainLayout'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Preview from './pages/Preview'

function App() {
  return (
    <>
      <Routes>
        <Route
          path='/home'
          element={<MainLayout><Home/></MainLayout>}
        ></Route>
        <Route
          path='/'
          element={<Login />}
        ></Route>
        <Route
          path='/signup'
          element={<Signup />}
        >
        </Route>
        <Route
          path='/profile-details'
          element={<MainLayout><Profile /></MainLayout>} 
        >
        </Route>
        <Route
          path='/preview/:id'
          element={<Preview />}
        ></Route>
      </Routes>
    </>
  )
}

export default App

