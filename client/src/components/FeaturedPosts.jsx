import ImageKit from "./PostImage";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`);
    return res.data;
    };

const FeaturedPosts = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["featuredPosts"],
        queryFn: () => fetchPost(),
    });

    if (isPending) return "loading...";
    if (error) return "Something went wrong!" + error.message;

    const posts = data.posts;
    if (!posts || posts.length === 0) {
        return;
    }

    return (
        <div className="flex flex-col gap-8 mt-8 lg:flex-row">
            {/* First */}
            {posts[0] && <div className="flex flex-col w-full gap-4 lg:w-1/2">
                {/* image */}
                {posts[0].img && <ImageKit src={posts[0].img} className="object-cover rounded-3xl" />}
                {/* detail */}
                <div className="flex items-center gap-4">
                    <h1 className="font-semibold lg:text-lg">01.</h1>
                    <Link className="text-blue-800 lg:text-lg">{posts[0].category}</Link>
                    <span className="text-gray-500">{format(posts[0].createdAt)}</span>
                </div>
                {/* title */}
                <Link to={posts[0].slug} className="text-xl font-semibold lg:text-3xl lg:font-bold">{posts[0].title}</Link>
            </div>}
            {/* Others */}
            <div className="flex flex-col w-full gap-4 lg:w-1/2">
                {/* Second */}
                {posts[1] && <div className="flex justify-between gap-4 ">
                    {posts[1].img && <div className="w-1/3 aspect-video">
                        <ImageKit src={posts[1].img} className="object-cover w-full h-full rounded-3xl" w="298" />
                    </div>}
                    {/* details and title */}
                    <div className="w-2/3">
                        {/* details */}
                        <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                            <h1 className="font-semibold">02.</h1>
                            <Link className="text-blue-800">{posts[1].category}</Link>
                            <span className="text-sm text-gray-500">{format(posts[1].createdAt)}</span>
                        </div>
                        {/* title */}
                        <Link to={posts[1].slug} className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">{posts[1].title}</Link>
                    </div>
                </div>}
                {/* Third */}
                {posts[2] && <div className="flex justify-between gap-4 ">
                        {posts[2].img && <div className="w-1/3 aspect-video">
                            <ImageKit src={posts[2].img} className="object-cover w-full h-full rounded-3xl" w="298" />
                        </div>}
                        {/* details and title */}
                        <div className="w-2/3">
                            {/* details */}
                            <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                                <h1 className="font-semibold">03.</h1>
                                <Link className="text-blue-800">{posts[2].category}</Link>
                                <span className="text-sm text-gray-500">{format(posts[2].createdAt)}</span>
                            </div>
                            {/* title */}
                            <Link to={posts[2].slug} className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">{posts[2].title}</Link>
                        </div>
                    </div>}
                {/* Fourth */}
                {posts[3] && <div className="flex justify-between gap-4 ">
                    {posts[3].img && <div className="w-1/3 aspect-video">
                        <ImageKit src={posts[3].img} className="object-cover w-full h-full rounded-3xl" w="298" />
                    </div>}
                    {/* details and title */}
                    <div className="w-2/3">
                        {/* details */}
                        <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                            <h1 className="font-semibold">04.</h1>
                            <Link className="text-blue-800">{posts[3].category}</Link>
                            <span className="text-sm text-gray-500">{format(posts[3].createdAt)}</span>
                        </div>
                        {/* title */}
                        <Link to={posts[3].slug} className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">{posts[3].title}</Link>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default FeaturedPosts