'use client'

import Image from "next/image"
const ExploreBtn = () => {
  return (
    <button  type="button" id="explore-btn" className="mt-5 mx-auto text-center mb-3" onClick={()=>{console.log("button clicked")}}>
      
      <a href="#events">
      Explore Events
      <Image src='/icons/arrow-down.svg' width={20} height={20} alt="explore-img"></Image>
      </a>
      </button>
      
  )
}

export default ExploreBtn