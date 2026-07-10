import React, { useEffect, useRef, useState } from 'react'
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";
import {assets, blogCategories} from '../../assets/assets.js'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'


const addBlog = () => {

  const navigate = useNavigate();

  const { axios, token } = useAppContext();

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image,setImage]= useState(false);
  const [title,setTitle]= useState('');
  const [subTitle,setSubTitle]= useState('');
  const [category,setCategory]= useState('Startup');
  const [isPublished,setIsPublished]= useState(false);

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const description = quillRef.current.root.innerHTML;

    const formData = new FormData();

    formData.append("image", image);

    formData.append(
      "blog",
      JSON.stringify({
        title,
        subTitle,
        description,
        category,
        isPublished,
      })
    );

    const { data } = await axios.post(
      "/blog/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (data.success) {
      toast.success(data.message);

      setImage(false);
      setTitle("");
      setSubTitle("");
      setCategory("Startup");
      setIsPublished(false);

      quillRef.current.setText("");

      navigate("/admin/listblog");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to add blog");
  }
  
};

  useEffect(()=>{
    if(!quillRef.current && editorRef.current)
    {
      quillRef.current = new Quill(editorRef.current, {theme: 'snow'})
    }
  },[])
  const generateContent  = async (e)=>{
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-auto'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>

        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer'/>
          <input onChange={(e)=> setImage(e.target.files[0])} type="file" id='image' hidden required/>
        </label>

        <p className='mt-4'>Blog title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={e=> setTitle(e.target.value)} value={title} />

        <p className='mt-4'>Sub Title</p>
        <input type="text" placeholder='Type here' required className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange={e=> setSubTitle(e.target.value)} value={subTitle} />

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-72 pb-16 sm:pb-10 pt-2 relative'>
          <div ref={editorRef}></div>
          <button type='button' onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>Generate with AI</button>
        </div>

        <p className='mt-4'>Blog category</p>
        <select onChange={e => setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded' id="">
          <option value="">Select Category</option>
          {blogCategories.map((item,index)=>{
            return <option key={index} value={item}>{item}</option>
          })}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input type="checkbox" checked={isPublished} className='scale-125 cursor-pointer' onChange={e =>setIsPublished(e.target.checked)} />
        </div>

        <button type='submit' className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'>Add Blog</button>
      </div>
      
    </form>
  )
}

export default addBlog
