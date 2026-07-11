import React from 'react'
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { assets } from '../../assets/assets';

const CommentTableItem = ({comment, fetchComments}) => {
    
    const { axios, token } = useAppContext();

    const {blog,createdAt,_id} = comment;
    // const BlogDate = new Date(createdAt);
    const BlogDate = createdAt ? new Date(createdAt) : null;

    const approveComment = async () => {
  try {
    const { data } = await axios.post(
      "/admin/approve-comment",
      {
        id: comment._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      fetchComments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to approve comment");
  }
};

const deleteComment = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmDelete) return;

  try {
    const { data } = await axios.post(
      "/admin/delete-comment",
      {
        id: comment._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      fetchComments();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete comment");
  }
};

  return (
    <tr className='border-y border-gray-300'>
        <td className='px-6 py-4'>
            <b className='font-medium text-gray-600'>Blog</b> : {blog.title}
            <br />
            <br />
            <b className='font-medium text-gray-600'>Name</b> : {comment.name}
            <br />
            <b className='font-medium text-gray-600'>Comment</b> : {comment.content}
        </td>
        <td className='px-6 py-4 max-sm:hidden'>
            {BlogDate.toLocaleDateString()}
        </td>
        <td className='px-6 py-4'>
            <div className='inline-flex items-center gap-4'>
                { !comment.isApproved ? 
                <img onClick={approveComment} src={assets.tick_icon} className='w-5 hover:scale-110 transition-all cursor-pointer' /> :
                <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1' alt="">Approved</p> 
                }
                <img onClick={deleteComment} src={assets.bin_icon} className='w-5 hover:scale-110 transition-all cursor-pointer'/>
            </div>
        </td>
    </tr>
  )
}

export default CommentTableItem
