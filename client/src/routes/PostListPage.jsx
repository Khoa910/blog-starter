import { useState } from "react";
import PostList from "../components/PostList"
import SideMenu from "../components/SideMenu";

const PostListPage = () => {
    const [ open, setOpen ] = useState(false)

    return (
        <div className=''>
            <h1 className="mb-8 text-4xl">Development Blog</h1> 
            <button onClick={() => setOpen((prev) => !prev)} className="px-4 py-2 mb-4 text-sm text-white bg-blue-800 md:hidden rounded-2xl">
                {open ? "Close" : "Filter on Search"}
            </button>
            <div className="flex flex-col-reverse justify-between gap-8 md:flex-row">
                <div className="">
                    <PostList/>
                </div>
                <div className={`${open ? "block" : "hidden"} md:block`}>
                    <SideMenu/>
                </div>
            </div>
        </div>
    );
};

export default PostListPage;