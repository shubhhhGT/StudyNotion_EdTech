import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const ExploreMore = () => {

    const tabNames = [
        "Free",
        "New to coding",
        "Most popular",
        "Skills paths",
        "Career paths"
    ]

    const [currentTab, setCurrentTab] = useState(tabNames[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [selectedCard, setSelectedCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((courses) => courses.tag === value);
        setCourses(result[0].courses);
        setSelectedCard(result[0].courses[0].heading)
    }

  return (
    <div>
        {/* Heading */}
        <div className='sm:w-full w-[90%] lg:text-4xl text-3xl font-semibold sm:text-center pl-3 sm:p-0'>
            Unlock the
            <HighlightText text={'Power of Code'}/>
        </div>

        {/* Sub Heading */}
        <div className='sm:text-center pl-3 sm:p-0 text-richblack-300 text-[16px] md:text-lg font-semibold mt-3'>
            Learn to Build Anything You Can Imagine
        </div>

        {/* Tabs */}
        <div className='hidden lg:flex gap-5 mt-5 mx-auto w-max bg-richblack-800 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
            {
                tabNames.map((element, index) => {
                    return (
                        <div className={`text-base flex flex-row items-center gap-2 
                         ${currentTab === element ? 'bg-richblack-900 text-richblack-5 font-medium':'text-richblack-200'} rounded-full transition-all duration-200 cursor-pointer
                          hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                            key={index}
                            onClick={() => setMyCards(element)}>
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className=' block h-[885px] min-[821px]:h-[550px] lg:h-[200px]'></div>
        {/* Course Cards */}
        <div className='absolute gap-10 mt-10 lg:mt-0 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full bottom-0 min-[821px]:translate-y-[25%] translate-y-[18%]  lg:translate-y-[50%] left-1/2 -translate-x-1/2 text-black lg:mb-0 mb-7 lg:px-0 px-3 sm:w-full sm:px-2 md:w-full md:px-4 lg:w-full'>
            {
                courses.map((element, index) => {
                    return(
                        <CourseCard
                        key={index}
                        cardData = {element}
                        selectedCard = {selectedCard}
                        setSelectedCard = {setSelectedCard}
                        />
                    )
                })
            }
        </div>
    </div>
  )
}

export default ExploreMore