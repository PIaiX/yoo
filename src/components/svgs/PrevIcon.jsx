import React from 'react'

const PrevIcon = ({className = ""}) => {
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.8573 7.42859L9.28589 13L14.8573 18.5714" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.9999 25.0714C19.6668 25.0714 25.0713 19.6669 25.0713 13C25.0713 6.33315 19.6668 0.928589 12.9999 0.928589C6.33303 0.928589 0.928467 6.33315 0.928467 13C0.928467 19.6669 6.33303 25.0714 12.9999 25.0714Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default PrevIcon