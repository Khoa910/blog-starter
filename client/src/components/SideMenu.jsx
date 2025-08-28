import Search from "./Search"
import { Link, useSearchParams } from "react-router-dom";

const SideMenu = () => {
    const [searchParams, setSearchParams] = useSearchParams(); // Hook of react-router-dom: used to get and change query params on URL

    // Function to handle when user changes sort filter
    const handleFilterChange = (e) => {
        if (searchParams.get("sort") !== e.target.value) {
            // Update search params, keep old params, only change "sort"
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                sort: e.target.value,
            });
        }
    };
    
    // Function to handle when user changes category
    const handleCategoryChange = (category) => {
        if (searchParams.get("cat") !== category) {
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cat:category,
        });
        }
    };

    return (
        <div className="sticky px-4 h-max top-8">
            <h1 className="mb-4 text-sm font-medium">Search</h1>
            <Search/>
            <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
            <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sort" value="newest" onChange={handleFilterChange}
                    className="appearance-none w-4 h-4 border-blue-800 cursor-pointer border-[1.5px] rounded-sm checked:bg-blue-800 bg-white"/>
                    Newest
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sort" value="popular" onChange={handleFilterChange}
                    className="appearance-none w-4 h-4 border-blue-800 cursor-pointer border-[1.5px] rounded-sm checked:bg-blue-800 bg-white"/>
                    Most Popular
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sort" value="trending" onChange={handleFilterChange}
                    className="appearance-none w-4 h-4 border-blue-800 cursor-pointer border-[1.5px] rounded-sm checked:bg-blue-800 bg-white"/>
                    Trending
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="sort" value="oldest" onChange={handleFilterChange}
                    className="appearance-none w-4 h-4 border-blue-800 cursor-pointer border-[1.5px] rounded-sm checked:bg-blue-800 bg-white"/>
                    Oldest
                </label>
            </div>
            <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
            <div className="flex flex-col gap-2 text-sm">
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("")}>All</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("general")}>General</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("web-design")}>Web Design</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("development")}>Development</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("databases")}>Databases</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("search-engines")}>Search Engines</span>
                <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("marketing")}>Marketing</span>
            </div>
        </div>
    )
}

export default SideMenu;