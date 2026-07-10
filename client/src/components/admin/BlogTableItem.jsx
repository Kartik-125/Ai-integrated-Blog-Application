import React from 'react'
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { assets } from '../../assets/assets.js';

const BlogTableItem = ({blog, fetchBlogs, index}) => {

  const { axios, token } = useAppContext();
  const{title, createdAt}= blog;
  const BlogDate = new Date(createdAt)

  const togglePublish = async () => {
  try {
    const { data } = await axios.post(
      "/blog/toggle-publish",
      {
        id: blog._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      fetchBlogs();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

const deleteBlog = async () => {
  
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this blog?"
  );

  if (!confirmDelete) return;

  try {
    const { data } = await axios.post(
      "/blog/delete",
      {
        blogId: blog._id,
      },
      {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      toast.success(data.message);
      fetchBlogs();
    } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete blog");
    }
  };

  return (
    <tr className='border-y border-gray-300'>
      <th className='px-2 py-4'>{index}</th>
      <td className='px-2 py-4'>{title}</td>
      <td className='px-2 py-4 max-sm:hidden'>{createdAt ? BlogDate.toDateString(): '-'}</td>
      <td className='px-2 py-4 max-sm:hidden'>
        <p className={blog.isPublished ? "text-green-600" : "text-orange-700"}>
            {blog.isPublished ? 'Published' : 'Unpublished'}</p>
      </td>
      <td className='px-2 py-4 flex text-xs gap-3'>
        <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>
          {blog.isPublished ? 'UnPublish' : 'Publish'}
        </button>
        <img onClick={deleteBlog} src={assets.cross_icon} alt="" className='w-8 hover:scale-110 transition-all cursor-pointer' />
      </td>
    </tr>
  )
}

export default BlogTableItem
