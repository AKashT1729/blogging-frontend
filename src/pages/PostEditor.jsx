import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import usePageTitle from "../hooks/usePageTitle";
import axios from "axios";

const PostEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;

  usePageTitle(isEditing ? "Edit Post" : "Create New Post");

  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    blogImageUrl: "",
    applyUrl: "", // New field for apply URL
    isPublished: false,
  });

  useEffect(() => {
    if (isEditing) {
      axios
        .get(`/api/v1/blogs/${id}`)
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error("Error fetching blog post:", error);
          toast.error("Failed to load the post.");
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`/api/v1/blogs/${id}`, post);
        toast.success("Post updated successfully!");
      } else {
        await axios.post("/api/v1/blogs", post);
        toast.success("Post created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save the post.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Post" : "Create New Post"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full px-4 py-2 border rounded-md h-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Image URL
          </label>
          <input
            type="url"
            value={post.blogImageUrl}
            onChange={(e) => setPost({ ...post, blogImageUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apply URL (optional)
          </label>
          <input
            type="url"
            value={post.applyUrl}
            onChange={(e) => setPost({ ...post, applyUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publish
          </label>
          <input
            type="checkbox"
            checked={post.isPublished}
            onChange={(e) => setPost({ ...post, isPublished: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Update Post" : "Publish Post"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Markdown Preview</h2>
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
      </div>
    </div>
  );
};

export default PostEditor;
