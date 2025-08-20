import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
};

const Comments = ({ postId }) => {
    const { user } = useUser();
    //console.log(user?.emailAddresses?.[0]?.emailAddress);
    const { getToken } = useAuth();
    
    //Get a list of comments for a post from the backend
    const { isPending, error, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
    });

    const queryClient = useQueryClient();
    
    const mutation = useMutation({
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] }); //reset to load a new list of comments
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            desc: formData.get("desc"),
        };

        mutation.mutate(data,{
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

    const renderCommentTree = (comment) => (
        <div key={comment._id} className="flex flex-col gap-3">
            <Comment comment={comment} postId={postId} />
            {Array.isArray(childrenByParentId[comment._id]) && childrenByParentId[comment._id].length > 0 && (
                <div className="pl-6 md:pl-10 flex flex-col gap-3">
                    {childrenByParentId[comment._id].map((child) => renderCommentTree(child))}
                </div>
            )}
        </div>
    );

    return(
        <div className="flex flex-col gap-8 mb-12 lg:w-3/5">
            <h1 className="text-xl text-gray-500 underline ">Comments</h1>
            <form onSubmit={handleSubmit} className="flex items-center justify-between w-full gap-8">
                <textarea name="desc" placeholder="Write a comment..." className="w-full p-4 rounded-xl"/>
                <button className="px-4 py-3 font-medium text-white bg-blue-800 rounded-xl">Send</button>
            </form>
            {/* Immediately display the comment you just posted on the interface, while the request sent to the server
             is still being processed (no response received yet). */}
            {isPending ? ("Loading...") : error ? ("Error loading comments!") : (
                <>
                {mutation.isPending && (
                    <Comment
                    comment={{
                        desc: `${mutation.variables.desc} (Sending...)`,
                        createdAt: new Date(),
                        user: {
                            img: user.imageUrl,
                            username: user.username,
                        },
                    }}
                    />
                )}

                {rootComments.map((comment) => renderCommentTree(comment))}
                </>
            )}
        </div>
    )
}

export default Comments;