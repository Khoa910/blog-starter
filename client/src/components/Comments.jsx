import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useMemo } from "react";

const Comments = ({ postId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    
    //Get a list of comments for a post from the backend with auth (to compute isLiked)
    const { isPending, error, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async () => {
            try {
                // If there is a token -> send Bearer so the backend knows which user is requesting
                const token = await getToken();
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`,
                    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
                );
                return res.data;
            } catch (err) {
                // If error (eg no token) -> try fetch without auth
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
                return res.data;
            }
        },
    });

    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: async (newComment) => {
            const token = await getToken();
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${postId}`,
                newComment,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data; // Return res.data so onSuccess receives saved directly
        },
        onMutate: async (newComment) => {
            await queryClient.cancelQueries({ queryKey: ["comments", postId] });
            const previous = queryClient.getQueryData(["comments", postId]);
            const optimistic = {
                _id: uuid(), // Use uuid() instead of temp-${Date.now()}
                desc: newComment.desc,
                createdAt: new Date().toISOString(),
                user: {
                    img: user?.imageUrl || null, // Ensure it's null if no image
                    username: user?.username || "Anonymous",
                },
                liked: 0,
                isLiked: false,
            };
            queryClient.setQueryData(["comments", postId], (old) => (Array.isArray(old) ? [optimistic, ...old] : [optimistic]));
            return { previous, optimisticId: optimistic._id };
        },
        onError: (error, _newComment, context) => {
            queryClient.setQueryData(["comments", postId], context?.previous);
            // Show detailed error message instead of raw data
            const errorMessage = error?.response?.data?.message || error?.response?.data || error?.message || "Failed to add comment";
            toast.error(errorMessage);
        },
        onSuccess: (saved, _newComment, context) => {
            // Now saved is directly the comment data, not the whole response
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
        onSettled: () => {
            // Sync completely after mutation settles (success or error)
            queryClient.invalidateQueries(["comments", postId]);
        },
        optimistic: true, // Enable optimistic updates for better UX
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

    // comments without replyId
    // const rootComments = Array.isArray(data) ? data.filter((c) => !c.replyId) : [];    
    // // Group children by parentId
    // const childrenByParentId = Array.isArray(data) ? data.reduce((acc, c) => {
    //         if (c.replyId) {
    //             const parentId = typeof c.replyId === "string" ? c.replyId : c.replyId?._id || c.replyId?.toString?.();
    //             if (parentId) {
    //                 if (!acc[parentId]) acc[parentId] = [];
    //                 acc[parentId].push(c);
    //             }
    //         }
    //         return acc;
    //     }, {})
    //     : {};

    // // Show 1 comment. If there are children → call renderCommentTree recursively to render all replies, then pl-3 to indent reply.
    // const renderCommentTree = (comment) => (
    //     <div key={comment._id} className="flex flex-col gap-3">
    //         <Comment comment={comment} postId={postId} onReplyAdded={handleReplyAdded} />
    //         {Array.isArray(childrenByParentId[comment._id]) && childrenByParentId[comment._id].length > 0 && (
    //             <div className="flex flex-col gap-3 pl-3 md:pl-4">
    //                 {childrenByParentId[comment._id].map((child) => renderCommentTree(child))}
    //             </div>
    //         )}
    //     </div>
    // );

    const handleReplyAdded = (reply) => {
        queryClient.setQueryData(["comments", postId], (old) => {
            if (!Array.isArray(old)) return old;
            return [reply, ...old]; // insert new reply at the beginning of the list
        });
    };
    
    // ensure that only when data changes will rootComments + childrenByParentId be recalculated without replyId (root) + group children by parentId
    const { rootComments, childrenByParentId } = useMemo(() => {
        if (!Array.isArray(data)) {
            return { rootComments: [], childrenByParentId: new Map() };
        }

        // comments without replyId
        const roots = data
            .filter((c) => !c.replyId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Group children by parentId
        const map = new Map();
        data.forEach((c) => {
            if (c.replyId) {
                const parentId =
                    typeof c.replyId === "string"
                        ? c.replyId
                        : c.replyId?._id || c.replyId?.toString?.();

                if (parentId) {
                    if (!map.has(parentId)) map.set(parentId, []); // has/get lookup faster than object
                    map.get(parentId).push(c);
                }
            }
        });

        // Sort children by createdAt
        for (const [key, list] of map.entries()) {
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        return { rootComments: roots, childrenByParentId: map };
    }, [data]);

    // Show 1 comment. If there are children → call renderCommentTree recursively to render all replies, then pl-3 to indent reply.
    const renderCommentTree = (comment) => (
        <div key={comment._id} className="flex flex-col gap-3">
            <Comment comment={comment} postId={postId} onReplyAdded={handleReplyAdded} />
            {childrenByParentId.has(comment._id) && (
                <div className="flex flex-col gap-3 pl-3 md:pl-4">
                    {childrenByParentId
                        .get(comment._id)
                        .map((child) => renderCommentTree(child))}
                </div>
            )}
        </div>
    );

    return(
        <div className="flex flex-col w-full max-w-4xl gap-8 mb-12 lg:w-2/3 xl:w-3/4">
            <h1 className="text-xl text-gray-500 underline ">Comments</h1>
            <form onSubmit={handleSubmit} className="flex items-center justify-between w-full gap-8">
                <textarea name="desc" placeholder="Write a comment..." className="w-full p-4 rounded-xl"/>
                <button 
                    type="submit"
                    disabled={addCommentMutation.isLoading}
                    className={`px-4 py-3 font-medium text-white rounded-xl ${
                        addCommentMutation.isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-800 hover:bg-blue-700'
                    }`}
                >
                    {addCommentMutation.isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
            {/* Immediately display the comment you just posted on the interface, while the request sent to the server
             is still being processed (no response received yet). */}
            {isPending ? ("Loading...") : error ? ("Error loading comments!") : (rootComments.map((comment) => renderCommentTree(comment)))}
        </div>
    )
}

export default Comments;