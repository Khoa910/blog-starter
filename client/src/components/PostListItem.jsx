import { Link } from "react-router-dom";
import ImageKit from "./Image";
import { format } from "timeago.js";

//children component receive an object like a prop(post) from parent component
const PostListItem = ({post}) => {
    return (
        <div className="flex flex-col gap-8 mb-8 xl:flex-row">
            {/* image */}
            {post.img && <div className="md:hidden xl:block xl:w-1/3">
                <ImageKit src={post.img} className="object-cover rounded-2xl" w="735"/>
            </div>}
            {/* details */}
            <div className="flex flex-col gap-4 break-words xl:w-2/3">
                <Link to={`/${post.slug}`} className="text-4xl font-semibold ">{post.title}</Link>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Written by</span>
                    <Link className="text-blue-800" to={`/posts?author=${post.user.username}`}>{post.user.username}</Link>
                    <span>on</span>
                    <Link className="text-blue-800">{post.category}</Link>
                    <span>{format(post.createdAt)}</span>
                </div>
                <p className="">
                    {post.desc}
                </p>
                <Link to={`/${post.slug}`} className="text-sm text-blue-800 underline">Read More</Link>
            </div>
        </div>
    )
}

export default PostListItem;