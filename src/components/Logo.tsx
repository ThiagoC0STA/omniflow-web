import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ width = 120, height = 42, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            d="M3 12L9 6L15 12L21 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 18L9 12L15 18L21 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Omni</h1>
        <p className="text-xs text-gray-600 -mt-1 font-medium">Flow Control</p>
      </div>
    </div>
  )
}
