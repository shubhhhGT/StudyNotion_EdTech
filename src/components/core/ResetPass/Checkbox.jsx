import React from 'react'
import Checksvg from './Checksvg'

const lowercaseChar = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const uppercaseChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const specialChar = ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Checkbox = ({password}) => {
    const hasLowercaseChar = lowercaseChar.some(char => password.includes(char));
    const hasUppercaseChar = uppercaseChar.some(char => password.includes(char));
    const hasSpecialChar = specialChar.some(char => password.includes(char));
    const hasNumber = numbers.some(num => password.includes(num));

  return (
    <div className='text-richblack-200 grid gap-2 justify-between grid-cols sm:grid-cols-2 mt-6'>
        <div className={`flex gap-x-2 text-sm ${hasLowercaseChar ? 'text-caribbeangreen-200' : 'text-richblack-200'} `} >
            <Checksvg/>
            <p>one lowercase character</p>
        </div>
        <div className={`flex gap-x-2 text-sm ${hasUppercaseChar ? 'text-caribbeangreen-200' : 'text-richblack-200'} `} >
            <Checksvg/>
            <p>one uppercase character</p>
        </div>
        <div className={`flex gap-x-2 text-sm ${hasSpecialChar ? 'text-caribbeangreen-200' : 'text-richblack-200'} `} >
            <Checksvg/>
            <p>one special character</p>
        </div>
        <div className={`flex gap-x-2 text-sm ${password.length >= 8 ? 'text-caribbeangreen-200' : 'text-richblack-200'} `}>
            <Checksvg/>
            <p>8 characters minimum</p>
        </div>
        <div className={`flex gap-x-2 text-sm ${hasNumber ? 'text-caribbeangreen-200' : 'text-richblack-200'} `} >
            <Checksvg/>
            <p>one number</p>
        </div>
    </div>
  )
}

export default Checkbox