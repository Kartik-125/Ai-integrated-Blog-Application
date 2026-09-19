import { blogCategories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion"
import BlogCard from './BlogCard'

const BlogList = ({ search }) => {

  const { axios } = useAppContext();

  const [blogs, setBlogs] = useState([]);
  const [menu, setMenu] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Tracks the category/search values from the last completed fetch,
  // so this effect can tell "the filters changed" apart from "just the
  // page changed" without needing two separate effects that could each
  // fire their own network request for the same change.
  const filtersRef = useRef({ menu, search });

  const fetchBlogs = async (pageToFetch) => {
    setLoading(true);

    try {
      const { data } = await axios.get("/blog/all", {
        params: {
          page: pageToFetch,
          category: menu,
          search,
        },
      });

      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtersChanged =
      filtersRef.current.menu !== menu || filtersRef.current.search !== search;

    filtersRef.current = { menu, search };

    // Switching category or search should always jump back to page 1.
    // If we're not already there, just update page and let this same
    // effect run again (page is in the dependency list below) — that
    // avoids firing two requests in a row for one filter change: one
    // with the stale page, then a second one correcting it.
    if (filtersChanged && page !== 1) {
      setPage(1);
      return;
    }

    fetchBlogs(filtersChanged ? 1 : page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, menu, search]);

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

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 mx-8 sm:mx-16 xl:mx-40'>
        {blogs.map((blog)=>(
          <BlogCard key={blog._id} blog={blog}/>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mb-20">Loading...</p>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-center text-gray-500 mb-20">
          No blogs found
        </p>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-24">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogList