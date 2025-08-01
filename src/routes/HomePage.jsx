import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div className="mt-4 flex flex-col gap-4">
            {/* Breadcrumb */}
            <div className="flex gap-4">
                <Link to="/">Home</Link>
                <span>•</span>
                <span className="text-blue-800">Blogs and Articles</span>
            </div>
            {/* Introduction */}
            {/* Features Posts */}
            {/* Post List */}
        </div>
    );
};

export default Homepage;