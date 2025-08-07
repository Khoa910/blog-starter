import { Link } from "react-router-dom";
import ImageKit from "./Image";

const PostListItem = () => {
    return (
        <div className="flex flex-col gap-8 xl:flex-row">
            {/* image */}
            <div className="md:hidden xl:block xl:w-1/3">
                <ImageKit src="postImg.jpeg" className="object-cover rounded-2xl" w="735"/>
            </div>
            {/* details */}
            <div className="flex flex-col gap-4 break-words xl:w-2/3">
                <Link to="/test" className="text-4xl font-semibold ">dsfsgfsgdsfgdfsgdgdfgsdgffdgsdfhfgdfsgdgdfgdfsgdgdfgdfsgdgdfg</Link>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Written by</span>
                    <Link className="text-blue-800">John Doe</Link>
                    <span>on</span>
                    <Link className="text-blue-800">Web Design</Link>
                    <span>2 days ago</span>
                </div>
                <p className="">
                    gfsgdsfgdfsgdgdfgsdgffdggfsgdsfgdfsgdgdfgsdgffdggfsgdsfgdfsgdgdfgsdgffdggfsgdsfgdfsgdgdfgsdgffdggfsgdsfgdfsgdgdfgsdgffdg
                </p>
                <Link to="/test" className="text-sm text-blue-800 underline">Read More</Link>
            </div>
        </div>
    )
}

export default PostListItem;