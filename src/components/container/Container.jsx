import React from 'react'

const Container = ({children}) => {
  return (
    <div className='w-full max-w-8xl mx-auto px-16'>
      {children}
    </div>
  )
}

export default Container
