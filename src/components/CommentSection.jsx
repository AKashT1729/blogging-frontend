import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [authorDetails, setAuthorDetails] = useState({
    name: '',
    email: '',
    rememberMe: false
  });
  const { user } = useAuth();

  // Load saved guest details
  useEffect(() => {
    const savedDetails = localStorage.getItem('commentAuthorDetails');
    if (savedDetails) {
      setAuthorDetails(JSON.parse(savedDetails));
    }
  }, []);

  // Save guest details when checkbox changes
  useEffect(() => {
    if (authorDetails.rememberMe) {
      localStorage.setItem('commentAuthorDetails', JSON.stringify(authorDetails));
    }
  }, [authorDetails.rememberMe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user?.isAdmin && (!authorDetails.name || !authorDetails.email)) {
      alert('Please fill in required fields');
      return;
    }

    const comment = {
      id: Date.now(),
      postId,
      author: user?.isAdmin ? 'Admin' : authorDetails.name,
      email: user?.isAdmin ? null : authorDetails.email,
      content: newComment,
      date: new Date().toISOString(),
      replies: [],
      parentId: replyingTo
    };

    if (replyingTo) {
      const updatedComments = comments.map(comment => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, comment]
          };
        }
        return comment;
      });
      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    } else {
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    }

    setNewComment('');
    setReplyingTo(null);
    
    if (!authorDetails.rememberMe) {
      setAuthorDetails(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handleDelete = (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confirmDelete) {
      const updatedComments = comments.filter(c => c.id !== commentId);
      setComments(updatedComments);
      localStorage.setItem('comments', JSON.stringify(updatedComments));
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      {!user?.isAdmin && (
        <form className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={authorDetails.name}
              onChange={(e) => setAuthorDetails(prev => ({...prev, name: e.target.value}))}
              className="p-2 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={authorDetails.email}
              onChange={(e) => setAuthorDetails(prev => ({...prev, email: e.target.value}))}
              className="p-2 border rounded"
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={authorDetails.rememberMe}
              onChange={(e) => setAuthorDetails(prev => ({...prev, rememberMe: e.target.checked}))}
            />
            Save my name and email in this browser for the next time I comment.
          </label>
        </form>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
          className="w-full p-3 border rounded"
          rows="3"
          required
        />
        <div className="flex justify-between items-center mt-2">
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {replyingTo ? 'Post Reply' : 'Post Comment'}
          </button>
          {replyingTo && (
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel Reply
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment.id} className="border p-4 rounded-lg relative">
            {user?.isAdmin && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-800">{comment.content}</p>

            {user?.isAdmin && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Reply as Admin
              </button>
            )}

            {comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4 border-l-2 pl-4">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="border p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{reply.author}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.date).toLocaleDateString()}
                      </span>
                      {user?.isAdmin && (
                        <button
                          onClick={() => handleDelete(reply.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-800">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
