import { format } from "timeago.js";
import ImageKit from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

/*Props:
 *  - comment: comment object (user, desc, createdAt, _id, ...; may have replyId if it's a reply)
 *  - postId: the id of the post (to invalidate comments query by post)
 */
const Comment = ({ comment, postId, onReplyAdded }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    // Role from Clerk publicMetadata (e.g., "admin")
    const role = user?.publicMetadata?.role;

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        // mutationFn: API request to delete comment
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
            // Remove the deleted comment from cache for this post
            queryClient.setQueryData(["comments", postId], (old) => {
                if (!Array.isArray(old)) return old;
                return old.filter((thisComment) => thisComment._id !== comment._id);
            });
            toast.success("Comment deleted successfully");
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    const [replying, setReplying] = useState(false); // Is the reply form open or not?
    const [replyText, setReplyText] = useState(""); // The text of comment reply
    const [liked, setLiked] = useState(!!comment.isLiked); // State of like
    const [likeCount, setLikeCount] = useState(typeof comment.liked === "number" ? comment.liked : 0); // Number of likes
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.desc);

    // Like/unlike mutation
    const likeMutation = useMutation({
        mutationFn: async ({ nextLiked }) => {
            const token = await getToken();
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
            if (nextLiked) {
                return axios.put(
                    `${import.meta.env.VITE_API_URL}/likes/${comment._id}`,
                    {},
                    config
                );
            }
            return axios.delete(
                `${import.meta.env.VITE_API_URL}/likes/${comment._id}`,
                config
            );
        },
        // Optimistic update (update before server returns)
        onMutate: async ({ nextLiked }) => {
            const previous = { prevLiked: liked, prevCount: likeCount };
            setLiked(nextLiked); //Update UI immediately
            setLikeCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
            return previous;
        },
        // If error -> rollback to old state
        onError: (err, _vars, context) => {
            setLiked(context?.prevLiked ?? false);
            setLikeCount(context?.prevCount ?? 0);
            toast.error("You need to login");
        },
        // If successful -> sync with server data (if any)
        onSuccess: (res) => {
            if (typeof res?.data?.liked === "number") {
                setLikeCount(res.data.liked);
            }
            if (typeof res?.data?.isLiked === "boolean") {
                setLiked(res.data.isLiked);
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
        onSuccess: (res) => {
            toast.success("Reply added");
            setReplyText("");
            setReplying(false);
            // Insert reply into cache without refetch using parent callback
            if (typeof onReplyAdded === "function") {
                const saved = res?.data;
                // Ensure minimal shape used by tree builder
                onReplyAdded({
                    ...saved,
                    liked: 0,
                    isLiked: false,
                });
            }
        },
        onError: () => {
            toast.error("Failed to add reply");
        },
    });

    const editMutation = useMutation({
        mutationFn: async ({ id, desc }) => {
            const token = await getToken();
            return axios.patch(`${import.meta.env.VITE_API_URL}/comments/${id}`, { desc },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );
        },
        onSuccess: (res) => {
            queryClient.setQueryData(["comments", postId], (old) => {
            if (!Array.isArray(old)) return old;
            return old.map((c) =>
                c._id === res.data._id ? { ...c, desc: res.data.desc } : c
            );
            });
            toast.success("Comment updated!");
        },
        onError: () => {
            toast.error("Failed to update comment");
        },
    });

    const handleSave = () => {
        editMutation.mutate({ id: comment._id, desc: editText },
        {
            onSuccess: () => {
            setIsEditing(false);
            },
        }
        )
    };

    return(
        <div className="mb-4">
            {/* Comment box */}
            <div className={`p-4 bg-slate-50 rounded-xl ${comment.replyId ? "border border-slate-200" : ""}`}>
                <div className="flex items-center gap-4">
                    {comment.user.img && (
                        <img 
                            src={comment.user.img} 
                            alt={comment.user.username}
                            className="object-cover w-10 h-10 rounded-full"
                        />
                    )}
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
                {isEditing ? (
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-2 border rounded"/>
                ) : (
                    <p>{comment.desc}</p>
                )}
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
                {user && (comment.user.username === user.username || role === "admin") && (
                    isEditing ? (
                    <>
                        <button
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        onClick={() => handleSave()}
                        >Save</button>
                        <button
                        className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => {
                            setIsEditing(false);
                            setEditText(comment.desc);
                        }}
                        >Cancel</button>
                    </>
                    ) : (
                    <button
                        className="hover:text-blue-500"
                        onClick={() => setIsEditing(true)}
                    >Edit</button>
                    )
                )}
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