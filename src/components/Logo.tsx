import React from 'react'
import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ width = 120, height = 42, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.svg"
        alt="Omniflow Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  )
}
