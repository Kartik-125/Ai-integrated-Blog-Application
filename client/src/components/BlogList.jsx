import React, {useState} from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from "framer-motion"
import BlogCard from './BlogCard'

const BlogList = () => {

    const [menu, setMenu] = useState('All')

  return (
    <div>
      <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
        {blogCategories.map((item)=>(
            <div key={item} className='relative'>
                <button onClick={()=>setMenu(item)} className={`cursor-pointer px-4 py-1 rounded-full text-sm transition-colors duration-200 ${menu === item ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                    {item}
                    {menu === item && (
                        <motion.div layoutId='underline' transition={{type:'spring', stiffness:500,damping:30}} className='absolute inset-0 -z-10  bg-primary rounded-full'></motion.div>
                    )}
                </button>
            </div>
        ))}

      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
        {blog_data.filter((blog)=>menu === "All" ? true : blog.category === menu).map((blog)=> <BlogCard key={blog._id} blog={blog}/>)}
      </div>
    </div>
  )
}

export default BlogList
