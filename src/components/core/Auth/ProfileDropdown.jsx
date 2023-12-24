import React, { useRef, useState } from 'react'
import {AiOutlineCaretDown} from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import {VscDashboard} from 'react-icons/vsc'
import {GoSignOut} from 'react-icons/go'

import useOnClickOutside from '../../../hooks/useOnClickOutside'
import {logout} from '../../../services/operations/authAPI'
import { Link, useNavigate } from 'react-router-dom'

const ProfileDropdown = () => {

  // Select user profile to get the user image
  const {user} = useSelector((state) => state.profile)

  // Using useDispatch and useNavigate to dispatch actions and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // using useState hook to update the state on clicking of the dropdown icon
  const [open, setOpen] = useState(false);

  // Using ref hook to update the handle the state changes to close the dropdown button
  const ref = useRef(null)

  // Using onClickOutside to handle state changes for clicking outside
  useOnClickOutside(ref, () => setOpen(false))

  // If user is not found, return null
  if (!user) return null

  return (
    <button className='relative' onClick={() => setOpen(true)}>
        <div className='flex items-center gap-x-1'>
          <img
            src={user?.image}
            alt={`${user?.firstName}`}
            className='w-[30px] aspect-square rounded-full object-cover'>
          </img>
          <AiOutlineCaretDown className='text-sm text-richblack-100'/>
          {
            open && (
              <div onClick={(event) => event.stopPropagation()} 
                className='absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 '
                ref={ref}>
                {/* Dashboard */}
                <Link to={'/dashboard/my-profile'} onClick={() => setOpen(false)}>
                  <div className='flex w-full items-center gap-x-1 text-sm px-[12px] py-[10px] text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 '>
                    <VscDashboard className='text-lg'/>
                    Dashboard
                  </div>
                </Link>

                {/* Logout */}
                <div className='flex w-full items-center gap-x-1 text-sm px-[12px] py-[10px] text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 '
                  onClick={() => {
                    dispatch(logout(navigate))
                    setOpen(false)
                  }}>
                  <GoSignOut className='text-lg'/>
                  Logout
                </div>
              </div>
            )
          }
        </div>
    </button>
  )
}

export default ProfileDropdown