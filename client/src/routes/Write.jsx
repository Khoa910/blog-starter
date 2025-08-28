import { useAuth, useUser } from "@clerk/clerk-react";
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {
    const { isLoaded, isSignIn } = useUser(); //React hook của clerk
    const [value, setValue] = useState("");
    const [cover, setCover] = useState("");
    const [img, setImg] = useState("");
    const [video, setVideo] = useState("");
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    //If an image/video is uploaded/selected, append <image>/<video> tag to `value` else keeps editor content in sync
    useEffect(() => {
        img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
    }, [img]);
    useEffect(() => {
        video && setValue((prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`);
    }, [video]);

    //mutation for creating a new post
    const { getToken } = useAuth();
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            const token = await getToken();
            return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
        })
        },
        onSuccess: (res) => {
            toast.success("Post created successfully!");
            navigate(`/${res.data.slug}`); //Navigate to the new post’s page (using slug from API response)
        }
    })

    //If Clerk hasn’t finished
    if(!isLoaded) {
        return <div className="">Loading...</div>
    }
    if(!isLoaded && !isSignIn) {
        return <div className="">You should login!</div>
    }

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target); //Collect values using FormData
        const data = {
            img: cover.filePath || "",
            title: formData.get("title"),
            category: formData.get("category"),
            desc: formData.get("desc"),
            content: value,
        }
        //console.log(data);
        mutation.mutate(data)
    }  
    
    return (
        <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="font-light text-cl">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-6 mb-6">
                <Upload type="image" setProgress={setProgress} setData={setCover}>
                    <button className="p-2 text-sm text-gray-500 bg-white shadow-sm w-max rounded-xl">Add a cover image</button>
                </Upload>
                
                <input className="text-4xl font-semibold bg-transparent outline-none" type="text" placeholder="My Awesome Story" name="title" />
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-sm">Choose a category:</label>
                    <select name="category" id="" className="p-2 bg-white shadow-md rounded-xl">
                        <option value="general">General</option>
                        <option value="web-design">Web Design</option>
                        <option value="development">Development</option>
                        <option value="databases">Databases</option>
                        <option value="search-engines">Search Engines</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <textarea className="p-4 bg-white shadow-md rounded-xl" name="desc" placeholder="A short description" />
                <div className="flex flex-1">
                    <div className="flex flex-col gap-2 mr-2">
                        <Upload type="image" setProgress={setProgress} setData={setImg}>🌆</Upload>
                        <Upload type="video" setProgress={setProgress} setData={setVideo}>▶️</Upload>
                    </div>
                    <ReactQuill 
                        theme="snow" 
                        className="flex-1 bg-white shadow-md rounded-xl" 
                        value={value} onChange={setValue} 
                        readOnly={0 < progress && progress < 100}/>
                </div>
                <button disabled={mutation.isPending || (0 < progress && progress < 100)} 
                className="p-2 mt-4 font-medium text-white bg-blue-800 rounded-xl w-36 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {mutation.isPending ? "Loading..." : "Post"}
                </button>
                {/* {"Progress" + progress} */}
                {/* {mutation.isError && <span>{mutation.error.message}</span>} */}
            </form>
        </div>
    );
};

export default Write;    