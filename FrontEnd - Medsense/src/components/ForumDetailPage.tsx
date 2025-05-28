import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getCurrentUser } from "../utils/auth";
import { ArrowLeft } from "../components/Icons";
import { createForumReply, getForumPostDetails, getForumReplies } from "../services/ForumService";

interface ForumPost {
  forum_id: string;
  user_id: string;
  status: string;
  forum_title: string;
  created_at: string;
  user_name: string;
}

interface ForumReply {
  reply_id: string;
  forum_id: string;
  user_id: string;
  reply_message: string;
  created_at?: string;
  user_name: string;
}

export default function ForumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [forum, setForum] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForumDetails();
      fetchForumReplies();
    }
  }, [id]);

  const fetchForumDetails = async () => {
    try {
      setLoading(true);
      const response = await getForumPostDetails(id ? id : "");
      const newResponse = {
        forum_id: response.ID,
        user_id: response.AuthorID,
        status: response.Status,
        forum_title: response.Title,
        created_at: response.CreatedAt,
        user_name: response.AuthorName
      }

      setForum(newResponse);
    } catch (error) {
      console.error("Error fetching forum details:", error);
      toast.error("Failed to load forum details");
      navigate('/forum');
    } finally {
      setLoading(false);
    }
  };

  const fetchForumReplies = async () => {
    if (!id) {
      setReplies([]);
      return;
    }
    try {
      const rawReplies = await getForumReplies(id);

      if (Array.isArray(rawReplies)) {
        const formattedReplies: ForumReply[] = rawReplies.map((reply: any) => ({
          reply_id: reply.ID,
          forum_id: reply.ForumPostID,
          user_id: reply.AuthorID,
          reply_message: reply.ReplyMessage,
          created_at: reply.CreatedAt, 
          user_name: reply.AuthorName
        }));
        setReplies(formattedReplies);
      } else {
        setReplies([]);
      }
    } catch (error) {
      console.error("Error fetching forum replies:", error);
      toast.error("Failed to load replies");
      setReplies([]);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to reply");
      return;
    }

    setIsSubmitting(true);

    try {
      await createForumReply(
        id ? id : "",
        currentUser.id,
        currentUser.name,
        replyContent
      );

      toast.success("Reply posted successfully");
      setReplyContent("");
      fetchForumReplies(); // Refresh replies
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-60">
        <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-500">Forum not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/forum')}
        className="flex items-center text-sky-600 hover:text-sky-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Forums
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-sky-100">
        <h1 className="text-2xl font-bold text-sky-800 mb-4">{forum.forum_title}</h1>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Posted by {forum.user_name}</span>
          <span>{formatDate(forum.created_at)}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-sky-700 mb-4">Responses</h2>

        {replies.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No responses yet. Be the first to respond!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.reply_id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <p className="text-gray-800 mb-3">{reply.reply_message}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Posted by {reply.user_name}</span>
                  <span>{reply.created_at && <span>{formatDate(reply.created_at)}</span>}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-sky-100">
        <h3 className="text-lg font-medium text-sky-700 mb-4">Leave a Response</h3>
        <form onSubmit={handleSubmitReply}>
          <div className="mb-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows={4}
              placeholder="Write your response here..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}