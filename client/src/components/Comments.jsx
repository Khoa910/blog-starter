import Comment from "./Comment";

const Comments = () => {
    return(
        <div className="flex flex-col gap-8 lg:w-3/5">
            <h1 className="text-xl text-gray-500 underline ">Comments</h1>
            <div className="flex items-center justify-center w-full gap-8">
                <textarea placeholder="Write a comment..." className="w-full p-4 rounded-xl"/>
                <button className="px-4 py-3 font-medium text-white bg-blue-800 rounded-xl">Send</button>
            </div>
            <Comment/>
            <Comment/>
            <Comment/>
            <Comment/>
            <Comment/>
            <Comment/>
            <Comment/>
            <Comment/>
        </div>
    )
}

export default Comments;