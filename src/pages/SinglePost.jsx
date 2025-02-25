import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePost = () => {
    const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || []
    const foundPost = savedPosts.find(p => p.id === Number(id))
    setPost(foundPost)
  }, [id])

  if (!post) return <div className="text-center py-8">Post not found</div>

  return (
    <>
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
          <div className="text-lg leading-relaxed">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </>
  );
};

export default SinglePost;
