import { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/footer/Footer.jsx'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { logout, login } from './store/authSlice.js'
import Loader from './pages/Loader.jsx'



function App() {
  const [loading, setloading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
   
      if(userData) dispatch(login({userData}))
      else dispatch(logout())
    })
    .finally(() => setloading(false ))
  },[dispatch])

  return !loading ? (
    
      <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
        <div className="w-full block">
          <Header />
          <main>
            <Outlet/>
           
          </main>
        </div>
        <div className="w-full block">
          <Footer/>
        </div>
      </div>
    
  ) : <Loader/>
}

export default App
