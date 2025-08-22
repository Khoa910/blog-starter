import { Link, useParams } from 'react-router-dom';
import ImageKit from '../components/PostImage';
import Image from '../components/Image';
import PostMenuActions from '../components/PostMenuActions';
import Search from '../components/Search';
import Comments from '../components/Comments';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
    const { slug } = useParams();

    const { isPending, error, data } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPost(slug), // Function to get post data by slug
    });

    if (isPending) return "loading...";
    if (error) return "Something went wrong!" + error.message;
    if (!data) return "Post not found!";

    //function to parse HTML content
    const parseContent = (html) => {
        // Create a temporary div to parse the HTML string into DOM nodes
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const result = [];
        temp.childNodes.forEach((node, idx) => {
            if (node.nodeName === "P") { // If it is a <p> tag
                if (node.innerText.trim()) {
                    result.push(<p key={idx}>{node.innerText}</p>); // If there is text -> add to the result array
                }
                const img = node.querySelector("img");
                if (img) {
                    // Add image to result array
                    result.push(<img key={`${idx}-img`} src={img.src} alt="" className="w-full max-w-[600px] h-auto max-h-[800px] object-cover rounded-xl mx-auto my-3 shadow-md"/>);
                }
            }
        });
        return result;
    };

    return (
        <div className="flex flex-col gap-8">
            {/* detail */}
            <div className="flex gap-8">
                <div className="flex flex-col gap-8 lg:w-3/5">
                    <h1 className="text-xl font-semibold md:text-3xl xl:text-4xl 2xl:text-5xl">
                        {data.title}
                    </h1>
                    {/* mobile/tablet cover image */}
                    {data.img && (
                        <div className="block lg:hidden">
                            <ImageKit src={data.img} w="800" className="w-full h-auto object-cover rounded-2xl" />
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Written by</span>
                        <Link className="text-blue-800">{data.user.username}</Link>
                        <span>on</span>
                        <Link className="text-blue-800">{data.category}</Link>
                        <span>{format(data.createdAt)}</span>
                    </div>
                    <p className="font-medium text-gray-500">
                        {data.desc}
                    </p>
                </div>
                {data.img && <div className="hidden w-2/5 lg:block">
                    <ImageKit src={data.img} w="600" className="rounded-2xl"/>
                </div>}
            </div>
            {/* content */}
            <div className="flex flex-col justify-between gap-12 md:flex-row">
                {/* text */}
                <div className="flex flex-col gap-6 text-justify lg:text-lg">
                    {parseContent(data.content)}
                </div>
                {/* menu */}
                <div className="sticky px-4 h-max top-8">
                    <h1 className="mb-4 text-sm font-medium">Author</h1>
                    <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-8">
                        {data.user.img && (<img 
                            src={data.user.img} 
                            alt={data.user.username}
                            className="object-cover w-10 h-10 rounded-full"
                        />)}
                        <Link className="text-blue-800">{data.user.username}</Link>
                    </div>
                        <p className="text-sm text-gray-500">sdf</p>
                        <div className="flex gap-2">
                            <Link>
                                <Image src="facebook.svg" />
                            </Link>
                            <Link>
                                <Image src="instagram.svg" />
                            </Link>
                        </div>
                    </div>
                    
                    <PostMenuActions post={data} />
                    {/* <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link className="underline">All</Link>
                        <Link className="underline" to="/">Web Design</Link>
                        <Link className="underline" to="/">Development</Link>
                        <Link className="underline" to="/">Databases</Link>
                        <Link className="underline" to="/">Search Engines</Link>
                        <Link className="underline" to="/">Marketing</Link>
                    </div> */}
                    <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
                    <Search/>
                </div>
            </div>
            <Comments postId={data._id} />
        </div>
    );
};

export default SinglePostPage;