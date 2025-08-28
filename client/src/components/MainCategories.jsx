import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
    return (
        <div className="items-center justify-center hidden gap-8 p-4 bg-white shadow-lg md:flex rounded-3xl xl:rounded-full">
            {/*links*/}
            <div className="flex flex-wrap items-center justify-between flex-1">
                <Link to="/posts" className="px-4 py-2 text-white bg-blue-800 rounded-full">
                    All Posts
                </Link>
                <Link to="/posts?cat=general" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    General
                </Link>
                <Link to="/posts?cat=web-design" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    Web Design
                </Link>
                <Link to="/posts?cat=development" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    Development
                </Link>
                <Link to="/posts?cat=databases" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    Databases
                </Link>
                <Link to="/posts?cat=search-engines" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    Search Engines
                </Link>
                <Link to="/posts?cat=marketing" className="px-4 py-2 rounded-full hover:bg-blue-50">
                    Marketing
                </Link>
            </div>
            <span className="text-xl font-medium">|</span>
            {/* search */}
            <Search/>
        </div>
    );
};

export default MainCategories;  