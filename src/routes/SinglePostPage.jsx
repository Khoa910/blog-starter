import { Link } from 'react-router-dom';
import ImageKit from '../components/Image';
import PostMenuActions from '../components/PostMenuActions';
import Search from '../components/Search';
import Comments from '../components/Comments';

const SinglePostPage = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* detail */}
            <div className="flex gap-8">
                <div className="flex flex-col gap-8 lg:w-3/5">
                    <h1 className="text-xl font-semibold md:text-3xl xl:text-4xl 2xl:text-5xl">
                        A whole new world god only knows
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Written by</span>
                        <Link className="text-blue-800">John Doe</Link>
                        <span>on</span>
                        <Link className="text-blue-800">Web Design</Link>
                        <span>2 days ago</span>
                    </div>
                    <p className="font-medium text-gray-500">
                        
                    </p>
                </div>
                <div className="hidden w-2/5 lg:block">
                    <ImageKit src="postImg.jpeg" w="600" className="rounded-2xl"/>
                </div> 
            </div>
            {/* content */}
            <div className="flex flex-col justify-between gap-12 md:flex-row">
                {/* text */}
                <div className="flex flex-col gap-6 text-justify lg:text-lg">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias neque
                    fugiat itaque quas esse sunt cupiditate possimus cumque asperiores,
                    dolorem, dolores eligendi amet perferendis illum repellat nam quam
                    facilis veritatis. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Sint ipsa fuga nihil numquam, quam dicta quas
                    exercitationem aliquam maxime quaerat, enim autem culpa sequi at!
                    Earum facere in ducimus culpa. Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Libero fuga modi amet error aliquid
                    eos nobis vero soluta facilis, voluptatem, voluptates quod suscipit
                    obcaecati voluptate quaerat laborum, voluptatum dicta ipsum.
                </p>
                </div>
                {/* menu */}
                <div className="sticky px-4 h-max top-8">
                    <h1 className="mb-4 text-sm font-medium">Author</h1>
                    <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-8">
                        <ImageKit src="userImg.jpeg" className="object-cover w-12 h-12 rounded-full" w="48" h="48"/>
                        <Link className="text-blue-800">John Doe</Link>
                    </div>
                        <p className="text-sm text-gray-500">dfsdfsdfsf</p>
                        <div className="flex gap-2">
                            <Link>
                                <ImageKit src="facebook.svg" />
                            </Link>
                            <Link>
                                <ImageKit src="instagram.svg" />
                            </Link>
                        </div>
                    </div>
                    
                    <PostMenuActions/>
                    <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link className="underline">All</Link>
                        <Link className="underline" to="/">Web Design</Link>
                        <Link className="underline" to="/">Development</Link>
                        <Link className="underline" to="/">Databases</Link>
                        <Link className="underline" to="/">Search Engines</Link>
                        <Link className="underline" to="/">Marketing</Link>
                    </div>
                    <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
                    <Search/>
                </div>
            </div>
            <Comments/>
        </div>
    );
};

export default SinglePostPage;