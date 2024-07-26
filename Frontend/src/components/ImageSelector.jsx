import React, { useRef } from 'react';
import ReactImageFileToBase64 from "react-file-image-to-base64";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageSelector = ({ podcast, setPodcast }) => {
    const fileInputRef = useRef(null);

    const handleOnCompleted = files => {
        setPodcast((prev) => {
            return { ...prev, thumbnail: files[0].base64_file };
        });
    };

    const CustomisedButton = ({ triggerInput }) => {
        fileInputRef.current = triggerInput;
        return (
            <div className="text-primary text-sm font-semibold cursor-pointer" onClick={triggerInput}>
                Browse Image
            </div>
        );
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current();
        }
    };

    return (
        <div
            className="cursor-pointer h-30 flex flex-col justify-center items-center gap-1.5 border-2 border-dashed border-text_primary80 rounded-lg text-text_primary80 mx-5 my-7"
            onClick={handleClick}
        >
            {podcast.thumbnail !== "" ? (
                <img src={podcast.thumbnail} alt="Thumbnail" className="h-[40vh] w-full object-scale-down rounded-lg" />
            ) : (
                <>
                    <CloudUploadIcon style={{ fontSize: "40px" }} />
                    <div className="text-sm font-semibold">Click here to upload thumbnail</div>
                    <div className="flex gap-1.5">
                        <div className="text-sm font-semibold">or</div>
                        <ReactImageFileToBase64
                            onCompleted={handleOnCompleted}
                            CustomisedButton={CustomisedButton}
                            multiple={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

ImageSelector.defaultProps = {
    podcast: { thumbnail: '' },
    setPodcast: () => {}
};

export default ImageSelector;