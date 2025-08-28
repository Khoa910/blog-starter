import { useState } from "react";
import SideMenu from "../components/SideMenu";
import SavePost from "../components/SavePost";
import Search from "../components/Search";

const SavedPostPage = () => {
    const [ open, setOpen ] = useState(false)

    return (
        <div className=''>
            <h1 className="mb-8 text-4xl">Saved Post</h1> 
            <button onClick={() => setOpen((prev) => !prev)} className="px-4 py-2 mb-4 text-sm text-white bg-blue-800 md:hidden rounded-2xl">
                {open ? "Close" : "Filter on Search"}
            </button>
            <div className="flex flex-col-reverse justify-between gap-8 md:flex-row">
                <div className="">
                    <SavePost/>
                </div>
            </div>
        </div>
    );
};

export default SavedPostPage;