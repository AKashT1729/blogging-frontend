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

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);

  usePageTitle(post?.title);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const foundPost = savedPosts.find((p) => p.id === Number(id));
    setPost(foundPost);
  }, [id]);

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      const updatedPosts = JSON.parse(localStorage.getItem("posts")).filter(
        (p) => p.id !== Number(id)
      );
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      navigate("/");
      toast.success("Post deleted successfully");
    }
  };

  if (!post) return <div className="text-center py-8">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover mb-8 rounded-lg"
          />
        )}
        <p className="text-gray-600 mb-4">
          Posted on {new Date(post.date).toLocaleDateString()}
        </p>
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
      {user && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
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
      <CommentSection postId={post.id} />
    </div>
  );
};

export default SinglePost;
