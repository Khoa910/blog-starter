import ImageKit from "./Image";
import { Link } from "react-router-dom";

const fetchPost = async () => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4&sort=newest`
    );
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
            <div className="flex flex-col w-full gap-4 lg:w1/2">
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
            </div>
            {/* Others */}
            <div className="flex flex-col w-full gap-4 lg:w1/2">
            {/* Second */}
            <div className="flex justify-between gap-4 lg:h-1/3">
                <div className="w-1/3 aspect-video">
                    <ImageKit src="featured2.jpeg" className="object-cover w-full h-full rounded-3xl" w="298" />
                </div>
            {/* details and title */}
                <div className="w-2/3">
                    {/* details */}
                    <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                        <h1 className="font-semibold">02.</h1>
                        <Link className="text-blue-800">Web Design</Link>
                        <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    {/* title */}
                    <Link to="/test" className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">Hi that</Link>
                </div>
            </div>
            {/* Third */}
            <div className="flex justify-between gap-4 lg:h-1/3">
                <div className="w-1/3 aspect-video">
                    <ImageKit src="featured3.jpeg" className="object-cover w-full h-full rounded-3xl" w="298" />
                </div>
            {/* details and title */}
                <div className="w-2/3">
                    {/* details */}
                    <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                        <h1 className="font-semibold">03.</h1>
                        <Link className="text-blue-800">Web Design</Link>
                        <span className="text-sm text-gray-500">4 days ago</span>
                    </div>
                    {/* title */}
                    <Link to="/test" className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">Hi that</Link>
                </div>
            </div>
            {/* Fourth */}
            <div className="flex justify-between gap-4 lg:h-1/3">
                <div className="w-1/3 aspect-video">
                    <ImageKit src="featured4.jpeg" className="object-cover w-full h-full rounded-3xl" w="298" />
                </div>
            {/* details and title */}
                <div className="w-2/3">
                    {/* details */}
                    <div className="flex items-center gap-4 mb-4 text-sm lg:text-base">
                        <h1 className="font-semibold">04.</h1>
                        <Link className="text-blue-800">Web Design</Link>
                        <span className="text-sm text-gray-500">6 days ago</span>
                    </div>
                    {/* title */}
                    <Link to="/test" className="text-base font-medium sm:text-lg md:text-2xl lg:text-xl xl:text-2xl">Hi that</Link>
                </div>
            </div>
            </div>
        </div>
    )
}

export default FeaturedPosts