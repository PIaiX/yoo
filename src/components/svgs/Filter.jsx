import React from 'react'

const Filter = ({className = ""}) => {
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.99999 12C5.65683 12 6.99997 10.6568 6.99997 8.99999C6.99997 7.34314 5.65683 6 3.99999 6C2.34314 6 1 7.34314 1 8.99999C1 10.6568 2.34314 12 3.99999 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 11.9998V26.9997" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 1V5.99998" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 12C25.6568 12 27 10.6568 27 8.99999C27 7.34314 25.6568 6 24 6C22.3431 6 21 7.34314 21 8.99999C21 10.6568 22.3431 12 24 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 5.99998V1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 26.9997V11.9998" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 17C15.6568 17 17 15.6568 17 14C17 12.3431 15.6568 11 14 11C12.3431 11 11 12.3431 11 14C11 15.6568 12.3431 17 14 17Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 1V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 16.9999V26.9998" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Filter