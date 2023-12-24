import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
import {ACCOUNT_TYPE} from '../../../utils/constants'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendOtp } from '../../../services/operations/authAPI'
import { setSignupData } from '../../../slices/authSlice'
import Tab from '../../../common/Tab'

const SignupForm = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Get the account type of user
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  // Handle input fields when value changes
  const changeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name] : event.target.value,
    }))
  }

  const submitHandler = (event) => {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword){
      toast.error("Passwords do not match")
      return
    }

    const signupData = {
      ...formData,
      accountType,
    }

    // Set signup data to the state
    dispatch(setSignupData(signupData))
    // Send otp for user verification
    dispatch(sendOtp(formData.email, navigate))

    // Reset the form data
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Data to be passed in tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR
    }
  ]

  return (
    <div>
        {/* Tab */}
        <Tab tabData={tabData} field={accountType} setField={setAccountType} />
        {/* Form */}
        <form onSubmit={submitHandler} className='flex flex-col w-full gap-y-4'>
          <div className='flex gap-x-4'>
            <label>
              <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5 '>
                First Name <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={changeHandler}
                placeholder='Enter first name'
                style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full bg-richblack-800 text-richblack-5 p-[12px] rounded-lg'/>
            </label>
            <label>
              <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5 '>
                Last Name <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={changeHandler}
                placeholder='Enter last name'
                style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full bg-richblack-800 text-richblack-5 p-[12px] rounded-lg'/>
            </label>
          </div>

          <label className='w-full'>
              <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5 '>
                Email Address <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type='email'
                name='email'
                value={formData.email}
                onChange={changeHandler}
                placeholder='Enter email address'
                // style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full form-style'/>
            </label>

            <div className='flex gap-x-4'>
              <label className='relative'>
                <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5 '>
                  Create Password <sup className='text-pink-200'>*</sup>
                </p>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={changeHandler}
                  placeholder='Enter password'
                  style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                  className='w-full bg-richblack-800 text-richblack-5 p-[12px] rounded-lg '
                />
                <span onClick={() => setShowPassword((prev) => (!prev))}
                className='absolute top-[38px] z-10 right-3 cursor-pointer'>
                  {
                    showPassword ? 
                    (
                      <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />
                    ) : 
                    (
                      <AiOutlineEye fontSize={24} fill='#AFB2BF'/>
                    )
                  }
                </span>
              </label>
              <label className='relative'>
              <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5 '>
                Confirm Password <sup className='text-pink-200'>*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={changeHandler}
                placeholder='Confirm password'
                style={{boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)"}}
                className='w-full bg-richblack-800 text-richblack-5 p-[12px] rounded-lg'
              />
              <span onClick={() => setShowConfirmPassword((prev) => (!prev))}
                className='absolute top-[38px] z-10 right-3 cursor-pointer'>
                  {
                    showConfirmPassword ? 
                    (
                      <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />
                    ) : 
                    (
                      <AiOutlineEye fontSize={24} fill='#AFB2BF'/>
                    )
                  }
                </span>
            </label>
            </div>

            <button type='submit'
            className='mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900'>
              Create Account
            </button>
        </form>
    </div>
  )
}

export default SignupForm