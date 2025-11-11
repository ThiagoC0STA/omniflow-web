import React from 'react'
import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
  className?: string
  whiteLogo?: boolean
}

export const Logo: React.FC<LogoProps> = ({ width = 120, height = 42, className, whiteLogo = false }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={whiteLogo ? "/OmniWhite.webp" : "/logo.svg"}
        alt="Omniflow Logo"
        width={width}
        height={height}
        quality={100}
        className="object-contain"
        priority
      />
    </div>
  )
}
