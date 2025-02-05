import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth.js'
import { logout } from '../../store/authSlice.js'
import { useNavigate } from 'react-router-dom'
import Loader from '../../pages/Loader.jsx'

const LogoutBtn = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const logoutHandler = () => {
      setLoading(true)
      authService.logout().then(() =>{
        dispatch(logout())

        navigate('/login')
        setLoading(false)
      }).catch((err) => {
        console.log("Login Failed :",err)
      })
    } 
    

  return (
    <>
    {loading ? (<Loader/>) : (
      <button 
        className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
        onClick={logoutHandler}
        >Logout</button>
    )}
        
    </>
  )
}

export default LogoutBtn
