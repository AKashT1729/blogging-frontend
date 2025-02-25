import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    setComments(storedComments.filter(c => c.postId === postId));
  }, [postId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to comment');

    const comment = {
      id: Date.now(),
      postId,
      author: user.name,
      content: newComment,
      date: new Date().toISOString()
    };

    const updatedComments = [...comments, comment];
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment('');
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 bg-gray-800 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
