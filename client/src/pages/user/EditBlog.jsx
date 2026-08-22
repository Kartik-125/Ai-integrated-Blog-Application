import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";
import { assets, blogCategories } from "../../assets/assets.js";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { axios, userToken } = useAppContext();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Startup");
  const [loading, setLoading] = useState(true);
  const [blogContent, setBlogContent] = useState("");

  // Initialize Quill
  useEffect(() => {
    if (!loading && !quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, [loading]);

  // Fetch user's blogs and find the blog being edited
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get("/blog/my-blogs", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (data.success) {
          const blog = data.blogs.find(
            (item) => item._id === id
          );

          if (!blog) {
            toast.error("Blog not found");
            navigate("/dashboard/my-blogs");
            return;
          }

          setTitle(blog.title);
          setExcerpt(blog.excerpt);
          setCategory(blog.category);
          setCurrentImage(blog.image);
          setBlogContent(blog.content);

          setLoading(false);
        } else {
          toast.error(data.message);
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog");
        setLoading(false)
      }
    };

    if (userToken && id) {
      fetchBlog();
    }
  }, [userToken, id]);

  useEffect(() => {
    if (!loading && quillRef.current && blogContent) {
      quillRef.current.root.innerHTML = blogContent;
    }
  }, [loading, blogContent]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!quillRef.current) {
        toast.error("Editor is not ready");
        return;
      }

      const content = quillRef.current.root.innerHTML;

      const plainText = quillRef.current.getText().trim();

      if (!plainText) {
        toast.error("Blog content is required.");
        return;
      }

      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }

      formData.append(
        "blog",
        JSON.stringify({
          title,
          excerpt,
          content,
          category,
        })
      );

      const { data } = await axios.post(
        `/blog/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/dashboard/my-blogs");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update blog");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading blog...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-auto"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">

        <p>Blog Thumbnail</p>

        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : currentImage || assets.upload_area
            }
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />

          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>

        <p className="mt-4">Blog title</p>

        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Excerpt</p>

        <input
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setExcerpt(e.target.value)}
          value={excerpt}
        />

        <p className="mt-4">Blog Description</p>

        <div className="max-w-lg h-72 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
        </div>

        <p className="mt-4">Blog category</p>

        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select Category</option>

          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <button
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          Update Blog
        </button>

      </div>
    </form>
  );
};

export default EditBlog;