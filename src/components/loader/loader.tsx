"use client"

import React from "react"
import Image from "next/image"

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="animate-pulse">
        <Image
          src="/loaders/Loader1.png"
          alt="Loading..."
          width={300}
          height={300}
          className="opacity-90 max-w-[80vw] max-h-[80vh] object-contain"
        />
      </div>
    </div>
  )
}

export default Loader
