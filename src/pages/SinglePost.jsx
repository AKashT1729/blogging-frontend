import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import toast from "react-hot-toast";
import usePageTitle from "../hooks/usePageTitle";
import axios from "axios";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageTitle(post?.title);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/v1/blogs/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load the post.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/v1/blogs/${id}`);
        toast.success("Post deleted successfully");
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete the post.");
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.blogImageUrl && (
          <img
            src={post.blogImageUrl}
            alt={post.title}
            className="w-full h-64 object-cover mb-8 rounded-lg"
          />
        )}
        <p className="text-gray-600 mb-4">
          Posted on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        {post.applyUrl && (
          <p className="mb-4">
            <a
              href={post.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Apply Here
            </a>
          </p>
        )}
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, "")}
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </article>
      {user?.isAdmin && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/edit/${post._id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Post
          </button>
        </div>
      )}
      <CommentSection postId={post._id} />
    </div>
  );
};

export default SinglePost;
