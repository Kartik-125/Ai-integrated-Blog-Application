import { blogCategories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"
import BlogCard from './BlogCard'

const BlogList = ({search}) => {

  const { axios } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [menu, setMenu] = useState('All');

  const fetchBlogs = async () => {
  try {
    const { data } = await axios.get("/blog/all");

    if (data.success) {
      setBlogs(data.blogs);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch blogs");
  }
};

useEffect(() => {
  fetchBlogs();
}, []);

const filteredBlogs = blogs.filter((blog) => {
  const matchesCategory =
    menu === "All" || blog.category === menu;

  const searchText = (search || "").toLowerCase();

  const plainDescription = blog.description
    ?.replace(/<[^>]*>/g, "")
    .toLowerCase();

  const matchesSearch =
    blog.title?.toLowerCase().includes(searchText) ||
    blog.subTitle?.toLowerCase().includes(searchText) ||
    blog.category?.toLowerCase().includes(searchText) ||
    blog.author?.toLowerCase().includes(searchText) ||
    plainDescription?.includes(searchText);

  return matchesCategory && matchesSearch;
});

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
        {filteredBlogs.map((blog)=>(
          <BlogCard key={blog._id} blog={blog}/>
        ))}
      </div>
      {filteredBlogs.length === 0 && (
        <p className="text-center text-gray-500 mb-20">
          No blogs found
        </p>
      )}
    </div>
  )
}

export default BlogList
