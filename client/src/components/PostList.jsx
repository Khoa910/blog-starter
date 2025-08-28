import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const fetchPosts = async (page, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: { page, limit: 10, ...searchParamsObj },
  });
  return res.data;
};

const PostList = () => {
    const [searchParams] = useSearchParams();
    const [page, setPage] = useState(1);

    const { data, error, isLoading, isFetching } = useQuery({
        queryKey: ["posts", page, searchParams.toString()],
        queryFn: () => fetchPosts(page, searchParams),
        keepPreviousData: true, // keep previous data when switching between pages
    });

    if (isFetching) return "Loading...";
    if (error) return "Something went wrong!";

    const renderPageNumbers = () => {
        const totalPages = data.totalPages;
        const currentPage = page;
        const maxVisible = 5; //  max button to display
        let pages = [];

        if (totalPages <= 7) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, "...", totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
            }
        }
        return pages;
    };

    return (
        <div className="p-4">
            {/* List post*/}
            <div className="flex flex-col"> {data?.posts.map((post) => (<PostListItem key={post._id} post={post} />))} </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
            <div className="flex flex-wrap items-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >Prev</button>

                {/* Nút số trang */}
                {renderPageNumbers().map((p, i) =>
                    p === "..." ? (<span key={i} className="px-3 py-1">...</span>) : (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 border rounded ${page === p ? "bg-blue-500 text-white" : "bg-white"}`}
                    >{p}</button>
                    )
                )}

                <button
                    disabled={page === data.totalPages}
                    onClick={() => setPage((old) => Math.min(old + 1, data.totalPages))}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >Next</button>
            </div>
            </div>
            {isFetching && <p className="text-sm text-gray-500">Đang tải...</p>}
        </div>
        );
};

export default PostList;