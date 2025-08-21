import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const Comments = ({ postId }) => {
    const { user } = useUser();
    //console.log(user?.emailAddresses?.[0]?.emailAddress);
    const { getToken } = useAuth();
    
    //Get a list of comments for a post from the backend with auth (to compute isLiked)
    const { isPending, error, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async () => {
            try {
                const token = await getToken();
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/comments/${postId}`,
                    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
                );
                return res.data;
            } catch (err) {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
                return res.data;
            }
        },
    });

    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getToken();
            return axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${postId}`,
                newComment,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        },
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({ queryKey: ["comments", postId] });
            const previous = queryClient.getQueryData(["comments", postId]);
            const optimistic = {
                _id: `temp-${Date.now()}`,
                desc: newComment.desc,
                createdAt: new Date().toISOString(),
                user: {
                    img: user?.imageUrl,
                    username: user?.username,
                },
                liked: 0,
                isLiked: false,
            };
            queryClient.setQueryData(["comments", postId], (old) => (Array.isArray(old) ? [optimistic, ...old] : [optimistic]));
            return { previous, optimisticId: optimistic._id };
        },
        onError: (error, _newComment, context) => {
            queryClient.setQueryData(["comments", postId], context?.previous);
            toast.error(error?.response?.data || "Failed to add comment");
        },
        onSuccess: (res, _newComment, context) => {
            const saved = res?.data;
            queryClient.setQueryData(["comments", postId], (old) => {
                if (!Array.isArray(old)) return old;
                const idx = old.findIndex((c) => c._id === context?.optimisticId);
                const enriched = {
                    ...saved,
                    user: { img: user?.imageUrl, username: user?.username },
                    liked: 0,
                    isLiked: false,
                };
                if (idx !== -1) {
                    const copy = old.slice();
                    copy[idx] = enriched;
                    return copy;
                }
                return [enriched, ...old];
            });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            desc: formData.get("desc"),
        };

        addCommentMutation.mutate(data,{
            onSuccess: () => {
                e.target.reset(); // clear textarea after successful submission
            },
        });
    };

    // Build a tree: map parentId -> children[] and list of roots (no replyId)
    const rootComments = Array.isArray(data) ? data.filter((c) => !c.replyId) : [];
    const childrenByParentId = Array.isArray(data) ? data.reduce((acc, c) => {
            if (c.replyId) {
                const parentId = typeof c.replyId === "string" ? c.replyId : c.replyId?._id || c.replyId?.toString?.();
                if (parentId) {
                    if (!acc[parentId]) acc[parentId] = [];
                    acc[parentId].push(c);
                }
            }
            return acc;
        }, {})
        : {};

    const handleReplyAdded = (reply) => {
        // Insert new reply into the cached flat list for this post
        queryClient.setQueryData(["comments", postId], (old) => {
            if (!Array.isArray(old)) return old;
            return [reply, ...old];
        });
    };

    const renderCommentTree = (comment, depth = 0) => {
        const children = Array.isArray(childrenByParentId[comment._id]) ? childrenByParentId[comment._id] : [];

        // Choose layout by depth:
        // depth 0: no indent
        // depth 1: indent a bit
        // depth >= 2: keep same indent as depth 1, add branch lines
        const baseIndent = depth === 0 ? "" : "pl-6 md:pl-10";

        const node = (
            <Comment key={comment._id} comment={comment} postId={postId} onReplyAdded={handleReplyAdded} />
        );

        const wrappedNode = depth <= 1 ? (
            <div key={comment._id} className={`flex flex-col gap-3 ${baseIndent}`}>
                {node}
            </div>
        ) : (
            <div key={comment._id} className={`flex flex-col gap-3 ${baseIndent}`}>
                <div className="flex gap-3">
                    <div className="relative w-4">
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300"></div>
                        <div className="absolute top-4 left-1/2 w-4 h-px bg-slate-300"></div>
                    </div>
                    <div className="flex-1">
                        {node}
                    </div>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col gap-3" key={`${comment._id}-wrap`}>
                {wrappedNode}
                {children.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {children.map((child) => renderCommentTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return(
        <div className="flex flex-col gap-8 mb-12 lg:w-3/5">
            <h1 className="text-xl text-gray-500 underline ">Comments</h1>
            <form onSubmit={handleSubmit} className="flex items-center justify-between w-full gap-8">
                <textarea name="desc" placeholder="Write a comment..." className="w-full p-4 rounded-xl"/>
                <button className="px-4 py-3 font-medium text-white bg-blue-800 rounded-xl">Send</button>
            </form>
            {/* Immediately display the comment you just posted on the interface, while the request sent to the server
             is still being processed (no response received yet). */}
            {isPending ? ("Loading...") : error ? ("Error loading comments!") : (rootComments.map((comment) => renderCommentTree(comment, 0)))}
        </div>
    )
}

export default Comments;