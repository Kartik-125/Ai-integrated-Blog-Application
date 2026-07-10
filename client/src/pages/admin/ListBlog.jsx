import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import BlogTableItem from '../../components/admin/BlogTableItem.jsx';

const ListBlog = () => {

  const { axios, token } = useAppContext();

  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
  try {
    const { data } = await axios.get("/admin/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

  useEffect(()=>{
    fetchBlogs()
  },[])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All Blogs</h1>
      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                  <thead className='text-xs text-gray-600 text-left uppercase'>
                    <tr>
                      <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                      <th scope='col' className='px-2 py-4'> Blog Title </th>
                      <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>  
                      <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
                      <th scope='col' className='px-2 py-4'> Actions </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog, index)=>{
                      return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index +1}/>
                    })}
                  </tbody>
                </table>
              </div>
      <div>
        
      </div>
      
    </div>
  )
}

export default ListBlog
