import * as React from 'react'

interface StatusProps {
  color: string
  status: string
}

export const Status: React.FC<StatusProps> = ({ color, status }) => {
  return (
    <div
      className="border text-highlight border-secondary bg-primary font-bold text-base px-2 py-1 mt-1 rounded-lg"
      style={{
        backgroundColor: color,
      }}
    >
      {status}
    </div>
  )
}
