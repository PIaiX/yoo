import React from 'react'

const Gift = ({className}) => {
  return (
    <svg className={className} width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.0711 4.85715H2.92829C2.21821 4.85715 1.64258 5.43278 1.64258 6.14286V10C1.64258 10.7101 2.21821 11.2857 2.92829 11.2857H17.0711C17.7812 11.2857 18.3569 10.7101 18.3569 10V6.14286C18.3569 5.43278 17.7812 4.85715 17.0711 4.85715Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.0716 11.2857V17.0714C17.0716 17.4124 16.9361 17.7394 16.695 17.9806C16.4539 18.2217 16.1268 18.3571 15.7859 18.3571H4.21443C3.87343 18.3571 3.54641 18.2217 3.30529 17.9806C3.06417 17.7394 2.92871 17.4124 2.92871 17.0714V11.2857" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 4.85715V18.3571" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.8569 1.64285L9.99972 4.85714L6.14258 1.64285" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Gift