import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>

        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full txt-sm text-primary'>
            <p>New: AI feature integrated</p>
            <img src={assets.star_icon} alt="" className='w-2.5'/>
        </div>
        
        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>Your own <span className='text-primary'>blogging</span> <br /> platform</h1>

      </div>
      <img src={assets.gradientBackground} alt=""className='absolute -top-50 -z-1 opacity-50' />
    </div>
  )
}

export default Header
