import { Image } from '@imagekit/react';

const ImageKit = ({ src, alt, className, w, h }) => {
    const urlEndpoint = import.meta.env.VITE_IK_URL_ENDPOINT;
    
    // If ImageKit is configured, use it
    if (urlEndpoint && !src.startsWith('http')) {
        return (
            <Image 
                urlEndpoint={urlEndpoint}
                path={src} 
                className={className}
                loading="lazy"
                lqip={{ active: true, quality: 20 }}
                alt={alt}
                width={w}
                height={h}
            />
        );
    }
    
    // Fallback to regular img tag
    return (
        <img 
            src={src.startsWith('http') ? src : `/${src}`}
            alt={alt}
            className={className}
            width={w}
            height={h}
            loading="lazy"
        />
    );
}

export default ImageKit;