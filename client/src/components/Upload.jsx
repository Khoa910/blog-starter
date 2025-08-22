import { toast } from "react-toastify";
import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";

// Async function to authenticate file upload with ImageKit (backend provides token, signature, publicKey)
const authenticator = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        // Parse response to JSON
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey }; // Return authentication information to ImageKit
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};


const Upload = ({children, type, setProgress, setData}) => {
    const ref = useRef(); // ref to trigger hidden file input

    const onError = (err) => {
        console.log(err);
        toast.error("Image upload failed!");
    };
    const onSuccess = (res) => {
        console.log(res);
        setData(res);
    }; 

    // Process while uploading → update progress %
    const onUploadProgress = (progress) => {
        console.log(progress);
        setProgress(Math.round((progress.loaded / progress.total) * 100));
    };
    return (
        <IKContext 
            publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
            urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
            authenticator={authenticator}
        >
            {/* Hidden file upload input, only trigger when div is clicked */}
            <IKUpload 
                useUniqueFileName //each file will generate a new name
                onError={onError}
                onSuccess={onSuccess}
                onUploadProgress={onUploadProgress}
                className="hidden"
                ref={ref}
                accept={`${type}/*`} // get image/video file depending on props "type"
            />
            {/* Replace with any UI, click will open file selection dialog */}
            <div className="cursor-pointer" onClick={() => ref.current.click()}>
                {children}
            </div>
        </IKContext>
    );
};

export default Upload;