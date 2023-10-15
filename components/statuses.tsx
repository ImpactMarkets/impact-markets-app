import * as React from 'react'

interface StatusProps {
  color: string
}

export const Statuses: React.FC<StatusProps> = ({ color }) => {
  return (
    <div
      className="border text-primary border-secondary bg-primary font-bold text-xs px-1 rounded"
      style={{
        backgroundColor: color,
      }}
    ></div>
  )
}
