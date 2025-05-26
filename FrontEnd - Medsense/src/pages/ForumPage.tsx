import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getCurrentUser } from "../utils/auth";
import { Plus } from "../components/Icons";

interface ForumPost {
  forum_id: number;
  user_id: number;
  status: string;
  forum_title: string;
  created_at: string;
  user_name: string;
}

export default function ForumPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchForumPosts();
  }, []);
  
  const fetchForumPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/forum-posts");
      setForumPosts(response.data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      toast.error("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newForumTitle.trim()) {
      toast.error("Please enter a forum title");
      return;
    }
    
    if (!currentUser) {
      toast.error("You must be logged in to create a forum");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:3001/forum-posts", {
        user_id: currentUser.id,
        forum_title: newForumTitle,
        status: "active"
      });
      
      toast.success("Forum created successfully");
      setNewForumTitle("");
      setShowCreateModal(false);
      fetchForumPosts(); // Refresh the list
    } catch (error) {
      console.error("Error creating forum:", error);
      toast.error("Failed to create forum");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sky-600">Community Forum</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Forum</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : forumPosts.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-500">No forum posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {forumPosts.map((post) => (
            <div 
              key={post.forum_id} 
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-sky-100"
              onClick={() => navigate(`/forum/${post.forum_id}`)}
            >
              <h2 className="text-lg font-medium text-sky-700 mb-2">{post.forum_title}</h2>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Posted by {post.user_name}</span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-sky-700 mb-4">Create New Forum</h2>
            <form onSubmit={handleCreateForum}>
              <div className="mb-4">
                <label htmlFor="forum_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Forum Title
                </label>
                <input
                  id="forum_title"
                  type="text"
                  value={newForumTitle}
                  onChange={(e) => setNewForumTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter a title for your forum"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newForumTitle.trim()}
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Forum"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}