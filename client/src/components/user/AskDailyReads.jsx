import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext.jsx";

const AskDailyReads = () => {
  const { axios, userToken } = useAppContext();

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [answer, setAnswer] = useState(null); // { text, sources }

  // Logged-out visitors never see the button — /api/ai/ask requires
  // userAuth, so there's nothing for them to use here.
  if (!userToken) return null;

  const handleAsk = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    setAsking(true);
    setAnswer(null);

    try {
      const { data } = await axios.post(
        "/ai/ask",
        { question: question.trim() },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (data.success) {
        setAnswer({ text: data.answer, sources: data.sources });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to get an answer");
    } finally {
      setAsking(false);
    }
  };

  return (
    <>
      {/* Floating toggle button, fixed to the corner on every page */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-black/80 cursor-pointer"
      >
        {open ? "Close" : "Ask DailyReads"}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col max-h-[70vh]">
          <div className="p-4 border-b">
            <p className="font-semibold">Ask DailyReads</p>
            <p className="text-xs text-gray-500">
              Ask a question and I'll answer using what's been published on
              the blog.
            </p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            {asking && <p className="text-sm text-gray-500">Thinking...</p>}

            {!asking && answer && (
              <div className="space-y-3">
                <p className="text-sm text-gray-800">{answer.text}</p>

                {answer.sources?.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Referenced from:
                    </p>
                    <ul className="space-y-1">
                      {answer.sources.map((source) => (
                        <li key={source.id}>
                          <Link
                            to={`/blog/${source.id}`}
                            onClick={() => setOpen(false)}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {source.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!asking && !answer && (
              <p className="text-sm text-gray-400">
                No question asked yet — try one below.
              </p>
            )}
          </div>

          <form onSubmit={handleAsk} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about the blog..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={asking}
              className="bg-black text-white text-sm px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Ask
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AskDailyReads;