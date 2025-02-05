import React, { useEffect } from 'react'
import authService from '../appwrite/auth.js'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import Logo from './Logo.jsx'
import { useForm } from 'react-hook-form'
import { useDispatch , useSelector } from 'react-redux'
import { clearAuthError, login } from '../store/authSlice.js'
import { Flag } from 'appwrite'
import Loader from '../pages/Loader.jsx'

const Signup = () => {
    const navigate = useNavigate()
    const [Error, setError] = useState("")
    const [loading , setLoading] = useState(false)

    const dispatch = useDispatch()
    const error = useSelector((state) => state.auth.authError)


    const { register, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => {
        dispatch(clearAuthError())
    },[])

    const createUser = async (data) => {
        setError("")
        try {
            setLoading(true)
            const userData = await authService.createAccount(data)
            if(!userData) setLoading(false)
            if (userData) {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    dispatch(login({currentUser}))
                    navigate('/')
                    setLoading(false)
                }
            }
        } catch (error) {
            setError(error.message)
         
        }
    }

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
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && (
                    <p className="text-red-600 mt-8 text-center">{error}</p>
                )}
                <form onSubmit={handleSubmit(createUser)} className="mt-8">
                    <div className="space-y-5">
                        <div>
                            <Input
                                label="Full Name : "
                                placeholder="Full Name"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 6,
                                        message: "Name must be at least 6 characters"
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: "Name must be less than 30 characters"
                                    }
                                })}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Email : "
                                placeholder="Email Address"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    minLength: {
                                        value: 5,
                                        message: "Email must be at least 5 characters"
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Email must be less than 50 characters"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Password : "
                                type="password"
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Password must be less than 20 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        )}
        
        </>
    )
}

export default Signup
