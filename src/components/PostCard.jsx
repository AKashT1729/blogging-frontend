import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
          <Link
            to={`/post/${post.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostCard;
