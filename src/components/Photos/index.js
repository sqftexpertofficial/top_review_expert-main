// components/Photos.js
import React, { useEffect, useRef, useState } from 'react';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { getPhotos } from "@/services"

const Photos = ({ containerId, title, id }) => {
    const [photos, setPhotos] = useState([])
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const Ref = useRef();
    const openFullScreen = (index) => {
        setIsFullScreen(true);
        setCurrentImageIndex(index);
    };

    const closeFullScreen = () => {
        setIsFullScreen(false);
        setCurrentImageIndex(0);
    };

    const fetchPics = async () => {
        try {
            let res = await getPhotos(id)
            setPhotos(res.photos || [])
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchPics()
    }, [id])

    return (
        <div id={containerId} className='mb-4 border-b py-4'>
            {/* Title */}
            <h3 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">{title}</h3>
            {/* <div>
                <UploadPhotos id={id} fetchPics={fetchPics} />
            </div> */}
            {/* List of Photos */}
            {photos && photos.length > 0 && <div className='overflow-y-auto h-[6rem] flex'>
                {photos && photos.map((photo, index) => (
                    <div key={index} className="cursor-pointer mr-2 flex-shrink-0" onClick={() => openFullScreen(index)}>
                        <img src={photo.url} alt={`Photo ${index + 1}`} className=" h-full" />
                    </div>
                ))}
            </div>}

            {/* Full Screen Gallery */}
            {isFullScreen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black z-50">
                    <button
                        className="absolute top-5 right-5 bg-white text-black py-2 px-4 rounded cursor-pointer text-lg z-50"
                        onClick={closeFullScreen}
                    >
                        Close
                    </button>
                    <Gallery
                        items={photos.map((photo, index) => ({
                            original: photo.url,
                            thumbnail: photo.url,
                            description: photo?.description ?? '',
                        }))}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        startIndex={currentImageIndex}
                        onClose={closeFullScreen}
                    />
                </div>
            )}
            {photos && photos.length === 0 && (
                <div className=" text-gray-600 p-4 max-sm:text-[12px]">
                    No product photos available. Be the first to upload photo.
                </div>
            )}
        </div>
    );
};

export default Photos;
