import { format } from "timeago.js";
import ImageKit from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

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
        </div>
    )
}

export default Comment;