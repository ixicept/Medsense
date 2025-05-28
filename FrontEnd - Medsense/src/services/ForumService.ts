import axiosInstance from "./AxiosInstance";

export const getAllPosts = async () => {
  try {
    const response = await axiosInstance.get("/forum/posts");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createForumPost = (userId: string, userName: string, forumTitle: string, status:string) => {
    try{
        const requestBody = {
            user_id: userId,
            user_name: userName, 
            forum_title: forumTitle,
            status: status
        };
        return axiosInstance.post("/forum/post", requestBody);
    }
    catch (error) {
        throw error;
    }
}

export const createForumReply = (postId: string, userId: string, userName: string, replyContent: string) => {
    try {
        const requestBody = {
            forum_post_id: postId,
            user_id: userId,
            user_name: userName,
            reply_message: replyContent
        };
        return axiosInstance.post("/forum/reply", requestBody);
    } catch (error) {
        throw error;
    }
}

export const getForumReplies = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/forum/posts/${postId}/replies`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getForumPostDetails = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/forum/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

