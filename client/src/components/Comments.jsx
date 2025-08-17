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
    //const { user } = useUser();
    //console.log(user?.emailAddresses?.[0]?.emailAddress);
    const { getToken } = useAuth();
    
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
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    });

    if (isPending) return "loading...";
    if (error) return "Something went wrong!" + error.message;
    if (!data) return "Comments not found!";

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const data = {
            desc: formData.get("desc"),
            //email: user?.emailAddresses?.[0]?.emailAddress, // Sure not null
        };

        mutation.mutate(data);
    };

    return(
        <div className="flex flex-col gap-8 mb-8 lg:w-3/5">
            <h1 className="text-xl text-gray-500 underline ">Comments</h1>
            <form onSubmit={handleSubmit} className="flex items-center justify-between w-full gap-8">
                <textarea name="desc" placeholder="Write a comment..." className="w-full p-4 rounded-xl"/>
                <button className="px-4 py-3 font-medium text-white bg-blue-800 rounded-xl">Send</button>
            </form>
            {data.map((comment) => (
                <Comment key={comment._id} comment={comment} postId={postId} />
            ))}
        </div>
    )
}

export default Comments;