"use client"

import React from "react"
import Image from "next/image"

const Loader = () => {
  return (
    <div className="flex items-center justify-center bg-white">
      {/* loader */}
      <div className="animate-pulse">
        <Image
          src="/loaders/Loader1.png" 
          alt="Loading..."
          width={200} 
          height={200}
          className="opacity-80"
        />
      </div>
    </div>
  )
}

export default Loader
