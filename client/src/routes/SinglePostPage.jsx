import { Link, useParams } from 'react-router-dom';
import ImageKit from '../components/PostImage';
import Image from '../components/Image';
import PostMenuActions from '../components/PostMenuActions';
import Comments from '../components/Comments';
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "timeago.js";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import Upload from '../components/Upload';

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
    const { slug } = useParams();
    const queryClient = useQueryClient();
    const { user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const { isPending, error, data } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPost(slug), // Function to get post data by slug
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        if (data) {
            setEditTitle(data.title);
            setEditDesc(data.desc);
            setEditContent(data.content);
        }
    }, [data]);
    
    const quillRef = useRef(null);

    const handleImageUpload = (img) => {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true); // get cursor position
        editor.insertEmbed(range.index, "image", img.url);
        editor.setSelection(range.index + 1); // set cursor after the inserted image
    };

    const handleVideoUpload = (video) => {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "video", video.url);
        editor.setSelection(range.index + 1);
    };
    
    const editMutation = useMutation({
        mutationFn: async ({ slug, title, desc, content }) => {
            const token = await getToken();
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${slug}`, { title, desc, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        },
        onSuccess: (updatedPost) => {
            queryClient.invalidateQueries(["post", updatedPost.slug]);
            if (updatedPost.slug !== slug) {
                navigate(`/${updatedPost.slug}`, { replace: true });
            }
            setIsEditing(false);
        },
        onError: (error) => {
            toast.error(error.response?.data || "Update failed");
        },
    });

    if (isPending) return "loading...";
    if (error) return "Something went wrong!" + error.message;
    if (!data) return "Post not found!";

    //function to parse HTML content
    const parseContent = (html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const renderNode = (node, key) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                return text ? text : null;
            }

            const tagName = node.nodeName.toLowerCase();

            // Map attributes
            const props = {};
            if (node.attributes) {
                Array.from(node.attributes).forEach(attr => {
                    props[attr.name] = attr.value;
                });
            }
            props.key = key;

            // Add Tailwind class to wrap code/pre blocks
            if (tagName === "pre") {
                props.className = "w-full max-w-full p-2 overflow-x-auto break-words whitespace-pre-wrap bg-gray-100 shadow-md rounded-xl";
            }
            if (tagName === "code") {
                props.className = "break-words whitespace-pre-wrap";
            }

            const children = Array.from(node.childNodes).map((child, i) => renderNode(child, `${key}-${i}`));
            return React.createElement(tagName, props, children.length ? children : null);
        };

        return Array.from(temp.childNodes).map((node, idx) => renderNode(node, idx));
    };

    const handleSave = () => {
        //console.log("Saving with slug:", data.slug);
        editMutation.mutate({
            slug: data.slug,
            title: editTitle,
            desc: editDesc,
            content: editContent,
        });
    };

    return (
        <div className="flex flex-col gap-8">
            {/* detail */}
            <div className="flex gap-8">
                <div className="flex flex-col gap-8 lg:w-4/5">
                    <h1 className="text-xl font-semibold md:text-3xl xl:text-4xl 2xl:text-5xl">
                        {data.title}
                    </h1>
                    {/* mobile/tablet cover image */}
                    {data.img && (
                        <div className="block lg:hidden">
                            <ImageKit src={data.img} w="800" className="object-cover w-full h-auto rounded-2xl" />
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Written by</span>
                        <Link className="text-blue-800">{data.user.username}</Link>
                        <span>on</span>
                        <Link className="text-blue-800">{data.category}</Link>
                        <span>{format(data.createdAt)}</span>
                        {user && (data.user.username === user.username) && (
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? "Cancel" : "Edit"}
                                </button>

                                {isEditing && (
                                    <>
                                        <Upload type="image" setData={handleImageUpload}>🌆</Upload>
                                        <Upload type="video" setData={handleVideoUpload}>▶️</Upload>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <input
                                className="p-2 text-lg font-semibold border rounded"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="Title"
                            />
                            <input
                                className="p-2 text-gray-600 border rounded text-md"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                placeholder="Description"
                            />
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                className="ql-editor w-full p-2 bg-white border rounded h-[500px]"
                                value={editContent}
                                onChange={setEditContent}
                            />
                            <button className="relative z-10 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={() => handleSave()}
                            >Save</button>
                        </div> 
                            ) : (
                                <p className="mt-2 font-medium text-gray-500">{data.desc}</p>
                    )}
                </div>
                {data.img && <div className="hidden w-1/5 lg:block">
                    <ImageKit src={data.img} w="600" className="rounded-2xl"/>
                </div>}
            </div>
            {/* content */}
            <div className="flex flex-col justify-between gap-12 md:flex-row">
                {/* text */}
                <div className={`flex flex-col gap-6 text-justify break-words lg:text-lg ${isEditing ? "invisible" : ""}`}>
                    {parseContent(data.content)}
                </div>
                {/* menu */}
                <div className="sticky top-[80px] h-max flex-shrink-0 w-full max-w-[250px] px-4 mt-8">
                    <h1 className="mb-4 text-sm font-medium">Author</h1>
                    {/* Author + Contact (horizontal for mobile(sm), vertical for lg) */}
                    <div className="flex flex-row items-center gap-4 lg:flex-col lg:items-start">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            {data.user.img && (
                                <img
                                src={data.user.img}
                                alt={data.user.username}
                                className="object-cover w-10 h-10 rounded-full"
                                />
                            )}
                            <Link className="text-blue-800">{data.user.username}</Link>
                        </div>
                        {/* Contact */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="hidden sm:inline">Contact:</span>
                            <div className="flex gap-2 ml-12 lg:ml-0">
                                <Link className="flex-shrink-0">
                                    <Image src="facebook.svg" className="w-5 h-5" />
                                </Link>
                                <Link className="flex-shrink-0">
                                    <Image src="instagram.svg" className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Actions: vertical for desktop, horizontal for mobile */}
                    <div className="flex flex-row gap-2 mt-4 lg:flex-col">
                        <PostMenuActions post={data}/>
                    </div>
                </div>
            </div>
            <Comments postId={data._id} />
        </div>
    );
};

export default SinglePostPage;