import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onLike, onComment }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.uid) || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id, !isLiked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
          <User className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {post.authorName || 'Anonymous Farmer'}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {post.location} • {new Date(post.createdAt?.toDate()).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
        {post.category && (
          <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
            {post.category}
          </span>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{post.likesCount || 0}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{post.commentsCount || 0}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-1 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Add Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment, index) => (
              <div key={index} className="flex space-x-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.authorName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {comment.content}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt?.toDate()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;