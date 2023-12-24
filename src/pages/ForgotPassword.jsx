import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {BiArrowBack} from 'react-icons/bi'
import { getPasswordResetToken } from '../services/operations/authAPI'
import Spinner from '../common/Spinner'

const ForgotPassword = () => {

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const {loading} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    };

  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            loading ? 
            (
                <div className='font-semibold text-3xl leading-[2.375rem] text-richblack-5'> <Spinner/></div>
            ) : 
            (
                <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='font-semibold text-3xl leading-[2.375rem] text-richblack-5'>
                        {
                            emailSent ? "Check Email" : "Reset your password"
                        }
                    </h1>

                    <p className='my-4 leading-[1.625rem] text-richblack-100 text-[1.125rem]'>
                        {
                            emailSent ? 
                            `We have sent the reset email to ${email}` :
                            "Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p className='mb-1 text-sm text-richblack-5'>
                                        Email Address <sup className='text-pink-200'>*</sup>
                                    </p>
                                    <input
                                        required
                                        type='email'
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Enter email address'
                                        className='form-style w-full'
                                    />
                                </label>
                            )
                        }

                        <button
                        type='submit'
                        className='mt-6 w-full rounded-lg bg-yellow-50 py-3 px-3 font-medium text-richblack-900'
                        >
                            {
                                emailSent ? 
                                "Resend Email" : 
                                "Reset Password"
                            }
                        </button>
                    </form>

                    <div className='mt-6 flex items-center justify-between'>
                        <Link to={'/login'}>
                            <p className='flex items-center gap-x-2 text-richblack-5'> 
                                <BiArrowBack/> Back to login
                            </p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword