import React,{ useState ,useEffect  } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../pages/Loader'

// This page will work as a wrapper that means if any page needs to be protected we wrape that page inside this component.

// I will write the logic of when user should have access to login or signup page and when they shouldn't.

const Protected = ({children, authentication = true}) => {

  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [loader, setloader] = useState(true)

  useEffect(() => {
    // This condition will check if the authstatus of the user is false means user is not logged in and trying to access those pages which are only accessible after logging in then user will be redirected to login page to login first.
    // Check if user is not authenticated and accessing a protected page
    if (authentication && !authStatus) {
      navigate('/login');
    } 
    // Check if user is authenticated and accessing login/signup pages
    else if (!authentication && authStatus) {
      navigate('/');
    } else {
      setloader(false); // Allow rendering when conditions are satisfied
    }
  }, [authentication, authStatus, navigate])
  

  // I need to remember one thing that i have to create a loader component which i will add up here instead of null if the loader is true
  return loader ? <Loader/> : <>{children}</>
}

export default Protected
