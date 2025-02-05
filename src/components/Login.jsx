import React, { useEffect } from 'react'
import authService from '../appwrite/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Logo from './Logo.jsx'
import { useForm } from 'react-hook-form'
import { useDispatch , useSelector } from 'react-redux'
import { login as authLogin, clearAuthError } from '../store/authSlice.js'
import Loader from '../pages/Loader.jsx'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [Error, setError] = useState("")
    const error = useSelector((state) => state.auth.authError)
    const [loading , setLoading] = useState(false)

    useEffect(() => {
        dispatch(clearAuthError())
    },[])

    const login = async(data) => {
        setError("")
        
        try {
            setLoading(true)
            const session = await authService.login(data)
            
            if(!session){
                setLoading(false)
            }
            if(session){
                
                const userData = await authService.getCurrentUser()
                
                if(userData){
                    
                    dispatch(authLogin({userData}))
                    navigate('/')
                    setLoading(false)
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }

    const handleClearAuthError = () => {
        dispatch(clearAuthError());
    };

    return (
        <>
        {loading ? (<Loader/>) : (
             <div className="flex items-center justify-center w-full">
             <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                 <div className="mb-2 flex justify-center">
                     <span className="flex justify-center w-full max-w-[100px]">
                         <Logo width="60%" />
                     </span>
                 </div>
                 <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                 <p className="mt-2 text-center text-base text-black/60">
                     Don&apos;t have any account?&nbsp;
                     <Link onClick={handleClearAuthError}
                         to="/signup"
                         className="font-medium text-primary transition-all duration-200 hover:underline"
                     >
                         Sign Up
                     </Link>
                 </p>
                 {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
                 <form onSubmit={handleSubmit(login)} className="mt-8">
                     <div className="space-y-5">
                         <div>
                             <Input
                                 label="Email : "
                                 placeholder="Email Address"
                                 type="email"
                                 {...register("email", {
                                     required: "Email is required",
                                     minLength: { value: 5, message: "Email must be at least 5 characters" },
                                     maxLength: { value: 50, message: "Email must be less than 50 characters" }
                                 })}
                             />  
                             {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                         </div>
                         <div>
                             <Input
                                 label="Password : " 
                                 type="password"
                                 placeholder="Password"
                                 {...register("password", {
                                     required: "Password is required",
                                     minLength: { value: 8, message: "Password must be at least 8 characters" },
                                     maxLength: { value: 20, message: "Password must be less than 20 characters" }
                                 })}
                             />
                             {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                         </div>
                         <Button  type="submit" className="w-full">
                             Sign in
                         </Button>
                     </div>
                 </form>
             </div>
         </div>
        ) }
       
        </>
    )
}

export default Login
