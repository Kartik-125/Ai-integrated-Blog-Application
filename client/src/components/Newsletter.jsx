import React from 'react'

const Newsletter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>
        Never miss a blog
      </h1>

      <p className='md:text-lg text-gray-500/70 pb-8'>
        Subscribe to get the latest blog, new tech, and exclusive news.
      </p>

      <form className='flex items-center justify-between max-w-2xl w-full md:h-14 h-12'>
        <input
          type='email'
          placeholder='Enter your Email id'
          required
          className='border border-gray-200 h-full w-full px-3 text-gray-500 outline-none rounded-md rounded-r-none'
        />

        <button
          type='submit'
          className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none'
        >
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default Newsletter
