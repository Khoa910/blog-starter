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

    const deleteMutation = useMutation({
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

    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(typeof comment.liked === "number" ? comment.liked : 0);

    const likeMutation = useMutation({
        mutationFn: async ({ nextLiked }) => {
            const token = await getToken();
            const endpoint = nextLiked ? "like" : "unlike";
            return axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${comment._id}/${endpoint}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onMutate: async ({ nextLiked }) => {
            const previous = { prevLiked: liked, prevCount: likeCount };
            setLiked(nextLiked);
            setLikeCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
            return previous;
        },
        onError: (err, _vars, context) => {
            setLiked(context?.prevLiked ?? false);
            setLikeCount(context?.prevCount ?? 0);
            toast.error("Failed to update like");
        },
        onSuccess: (res) => {
            if (typeof res?.data?.liked === "number") {
                setLikeCount(res.data.liked);
            }
        },
    });

    // Reply mutation
    const replyMutation = useMutation({
        mutationFn: async ({ text }) => {
            const token = await getToken();
            return axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${comment._id}/reply`,
                { desc: text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            toast.success("Reply added");
            setReplyText("");
            setReplying(false);
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: () => {
            toast.error("Failed to add reply");
        },
    });

    return(
        <div className="mb-4">
            {/* Khung comment */}
            <div className={`p-4 bg-slate-50 rounded-xl ${comment.replyId ? "border border-slate-200" : ""}`}>
                <div className="flex items-center gap-4">
                    {comment.user.img && (<ImageKit src={comment.user.img} className="object-cover w-10 h-10 rounded-full" w="40"/>)}
                    <span className="font-medium">{comment.user.username}</span>
                    <span className="text-sm text-gray-500">{format(comment.createdAt)}</span>
                    {user && (comment.user.username === user.username || role === "admin") && (
                        <span className="ml-auto text-xs text-red-300 cursor-pointer hover:text-red-500" onClick={() => deleteMutation.mutate()}>
                            delete
                            {deleteMutation.isPending && <span>(in progress)</span>}
                        </span>
                    )}
                </div>
            <div className="mt-4">
                <p>{comment.desc}</p>
            </div>
            </div>

            {/* Like + Reply actions */}
            <div className="flex items-center gap-6 mt-2 ml-12 text-sm text-gray-600">
                <button onClick={() => likeMutation.mutate({ nextLiked: !liked })} className={`flex items-center gap-1 hover:text-blue-500 ${liked ? "text-blue-600 font-medium" : ""}`}>
                    {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    Like
                    {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
                </button>
                <button onClick={() => setReplying(!replying)} className="hover:text-blue-500">Reply</button>
            </div>

            {/* Reply box */}
            {replying && (
            <div className="flex items-center gap-2 mt-2 ml-12">
                <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={() => replyMutation.mutate({ text: replyText })} className="px-3 py-1 text-sm text-white bg-blue-800 rounded-lg">Send</button>
            </div>
            )}
        </div>
    )
}

export default Comment;