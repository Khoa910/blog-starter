import ImageKit from "./Image";

const Comment = () => {
    return(
        <div className="p-4 mb-8 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-4">
                <ImageKit src="userImg.jpeg" className="object-cover w-10 h-10 rounded-full" w="40"/>
                <span className="font-medium">John Doe</span>
                <span className="text-sm text-gray-500">2 days ago</span>
            </div>
            <div className="mt-4">
                <p>One significant challenge with React when building a blog is managing dynamic metadata effectively. Unlike Next.js, which has built-in support for handling metadata, finding a solution using only React can be tricky. Since it’s a blog, having dynamic metadata for each post is essential, and I’m exploring ways to address this without relying on Next.js. Maybe a tuts from you to address this, will be helpful</p>
            </div>
        </div>
    )
}

export default Comment;