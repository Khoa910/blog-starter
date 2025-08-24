import PostListItem from "./PostListItem";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

//call API to get list of posts by page and search parameters
const fetchSavedPosts = async (pageParam, searchParams, userId) => {
    const searchParamsObj = Object.fromEntries([...searchParams]);

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/savedposts`, {
        params: { page: pageParam, limit: 10, userId, ...searchParamsObj }
    });

    return res.data;
};

const SavePost = () => {
    const [searchParams] = useSearchParams();
    const { user } = useUser(); // lấy user đang login từ Clerk

    const { data, error, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
        queryKey: ["savedPosts", searchParams.toString(), user?.id],
        queryFn: ({ pageParam = 1 }) => fetchSavedPosts(pageParam, searchParams, user?.id),
        enabled: !!user, // chỉ gọi API khi có user
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) =>
            lastPage.hasMore ? pages.length + 1 : undefined,
    });

    if (isFetching && !data) return "Loading...";
    if (error) return "Something went wrong!";

    const allSavedPosts = data?.pages?.flatMap(page => page.posts) || [];

    return (
        <InfiniteScroll
            dataLength={allSavedPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Loading more posts...</h4>}
            endMessage={
                allSavedPosts.length > 0 ? (
                    <p><b>All saved posts loaded!</b></p>
                ) : <p>No saved posts yet.</p>
            }
        >
            {allSavedPosts.map((post) => (
                <PostListItem key={post._id} post={post} />
            ))}
        </InfiniteScroll>
    );
};

export default SavePost;