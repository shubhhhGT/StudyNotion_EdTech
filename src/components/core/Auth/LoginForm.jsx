import React from 'react'
import { useState } from 'react'
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/operations/authAPI';

const LoginForm = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({email: "", password: ""});

    const [showPassword, setShowPassword] = useState(false);

    const changeHandler = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value,
        }))
    }

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(login(formData.email, formData.password, navigate))
    }

  return (
    <form className='mt-6 flex w-full flex-col gap-y-4' onSubmit={submitHandler}>
        <label className='w-full'>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                Email Address <sup className='text-pink-200'>*</sup>
            </p>
            <input
                required
                type='email'
                name='email'
                value={formData.email}
                placeholder='Enter email address'
                onChange={changeHandler}
                style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full form-style'
            />
        </label>

        <label className='w-full relative'>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5'>
                Password <sup className='text-pink-200'>*</sup>
            </p>
            <input
                required
                type= {showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                placeholder='Enter Password'
                onChange={changeHandler}
                style={{boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.18)',}}
                className='w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5'
            />
            <span className='absolute right-3 top-[38px] z-[10] cursor-pointer'
            onClick={() => setShowPassword((prev) => !prev)}>
                {
                    showPassword ? 
                    <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/> :
                    <AiOutlineEye fontSize={24} fill='#AFB2BF'/>
                }
            </span>
            <Link to={'/forgot-password'}>
                <p className='mt-1 text-xs ml-auto max-w-max text-blue-200'>
                    Forgot Password
                </p>
            </Link>
        </label>
        <button type='submit' className='mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900'>
            Sign In
        </button>
    </form>
  )
}

export default LoginForm