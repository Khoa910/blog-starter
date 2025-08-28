import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
    const location = useLocation(); // get information about the current URL (pathname, search, hash, ...)
    const navigate = useNavigate(); // used to navigate to another route
    const [searchParams, setSearchParams] = useSearchParams();

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
          const query = e.target.value; // Get the value in the input box
          if (location.pathname === "/posts") {
              // Only update the query param "search" in the current URL
              setSearchParams({ ...Object.fromEntries(searchParams), search: query });
          } else {
              navigate(`/posts?search=${query}`);
          }
      }
    };
      return (
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="gray"
        >
          <circle cx="10.5" cy="10.5" r="7.5" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input type="text" placeholder="search a post..." className="bg-transparent" onKeyDown={handleKeyPress} />
      </div>
    );
  }

export default Search;