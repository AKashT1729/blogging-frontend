import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 6;
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
    setLoading(false);
  }, []);

  const filteredPosts = posts.filter(post => {
    return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) =>
            setSearchParams({
              ...Object.fromEntries(searchParams),
              search: e.target.value,
            })
          }
          className="p-2 border rounded w-full md:w-64"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() =>
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: i + 1,
                  })
                }
                className={`px-4 py-2 rounded ${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
