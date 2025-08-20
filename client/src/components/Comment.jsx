import { format } from "timeago.js";
import ImageKit from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

const Comment = ({ comment, postId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const role = user?.publicMetadata?.role;

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.delete(
                `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            toast.success("Comment deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    const [liked, setLiked] = useState(false);
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    // Xử lý Like
    const handleLike = () => {
        setLiked(!liked);
        // Nếu muốn gọi API like thì viết ở đây
        // axios.post(`${API}/comments/${comment._id}/like`, { userId: user.id })
    };

    // Xử lý Reply
    const handleReply = async () => {
        if (!replyText.trim()) return;

        try {
            const token = await getToken();
            await axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${comment._id}/reply`,
                { text: replyText },
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                }
            );

            toast.success("Reply added");
            setReplyText("");
            setReplying(false);
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        } catch (err) {
            toast.error("Failed to add reply");
        }
    };

    return(
        <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-4">
                {comment.user.img && (
                    <ImageKit
                        src={comment.user.img}
                        className="object-cover w-10 h-10 rounded-full"
                        w="40"
                    />
                )}
                <span className="font-medium">{comment.user.username}</span>
                <span className="text-sm text-gray-500">{format(comment.createdAt)}</span>
                {user && (comment.user.username === user.username || role === "admin") && (
                    <span
                    className="ml-auto text-xs text-red-300 cursor-pointer hover:text-red-500"
                    onClick={() => mutation.mutate()}
                    >
                    delete
                    {mutation.isPending && <span>(in progress)</span>}
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p>{comment.desc}</p>
            </div>

            {/* Like + Reply actions */}
            <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <button
                onClick={handleLike}
                className={`flex items-center gap-1 hover:text-blue-500 ${
                    liked ? "text-blue-600 font-medium" : ""
                }`}
                >
                {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                Like
                </button>

                <button
                onClick={() => setReplying(!replying)}
                className="hover:text-blue-500"
                >
                Reply
                </button>
            </div>

            {/* Reply box */}
            {replying && (
                <div className="flex items-center gap-2 mt-2">
                <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                    onClick={handleReply}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
                </div>
            )}
        </div>
    )
}

export default Comment;