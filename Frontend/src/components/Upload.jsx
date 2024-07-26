import { BackupRounded, CloseRounded, CloudDoneRounded } from '@mui/icons-material';
import { CircularProgress, LinearProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from 'react';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import ImageSelector from "./ImageSelector";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { createPodcast } from '../api';
import { Category } from '../utils/Data';

const Upload = ({ setUploadOpen }) => {
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const [podcast, setPodcast] = useState({
        name: "",
        desc: "",
        thumbnail: "",
        tags: [],
        category: "",
        type: "audio",
        episodes: [
            {
                name: "",
                desc: "",
                type: "audio",
                file: "",
                uploadProgress: 0,
                uploaded: false,
            }
        ],
    });
    const [showEpisode, setShowEpisode] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [backDisabled, setBackDisabled] = useState(false);
    const [createDisabled, setCreateDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const token = localStorage.getItem("auth-token");
    
    const goToAddEpisodes = () => {
        setShowEpisode(true);
    };

    const goToPodcast = () => {
        setShowEpisode(false);
    };

    useEffect(() => {
        if (podcast === null) {
            setDisabled(true);
            setPodcast({
                name: "",
                desc: "",
                thumbnail: "",
                tags: [],
                episodes: [
                    {
                        name: "",
                        desc: "",
                        type: "audio",
                        file: "",
                        uploadProgress: 0,
                        uploaded: false,
                    }
                ],
            });
        } else {
            if (podcast.name === "" && podcast.desc === "") {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    }, [podcast]);

    const uploadFile = (file, index) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                podcast.episodes[index].uploadProgress = Math.round(progress);
                setPodcast({ ...podcast, episodes: [...podcast.episodes] });
            },
            (error) => {
                console.error(`Error uploading file for episode ${index}:`, error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const newEpisodes = [...podcast.episodes];
                    newEpisodes[index].file = downloadURL;
                    newEpisodes[index].uploaded = true;
                    setPodcast({ ...podcast, episodes: newEpisodes });
                }).catch((error) => {
                    console.error('Error getting download URL:', error.message);
                });
            }
        );
    };

    const createPodcast = async () => {
        setLoading(true);
        try {
            const res = await createPodcast(podcast, token);
            setDisabled(true);
            setBackDisabled(true);
            setUploadOpen(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Podcast created successfully',
                    severity: 'success',
                })
            );
        } catch (err) {
            setDisabled(false);
            setBackDisabled(false);
            setLoading(false);
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Error creating podcast',
                    severity: 'error',
                })
            );
        }
    };
      
    useEffect(() => {
        const isValidPodcast = 
            podcast.name !== "" &&
            podcast.desc !== "" &&
            podcast.tags.length > 0 &&
            podcast.category !== "" &&
            podcast.episodes.every(episode => 
                episode.file !== "" &&
                episode.name !== "" &&
                episode.desc !== "" &&
                episode.uploaded
            );
    
        setCreateDisabled(!isValidPodcast);
    }, [podcast]);

    return (
        <Modal open={true} onClose={() => setUploadOpen(false)}>
            <div 
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-70 overflow-y-scroll transition-all ease-in-out duration-500"
            >
                <div
                    style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.color }} 
                    className="max-w-screen-md w-full rounded-lg m-10 overflow-hidden flex flex-col relative"
                >
                    <CloseRounded
                        className="absolute top-2 right-4 cursor-pointer"
                        onClick={() => setUploadOpen(false)}
                    />
                    <div className="font-bold text-xl m-6">Upload Podcast</div>
                    {!showEpisode ? (
                        <div className="p-4">
                            <div className="font-semibold text-lg mb-2">Podcast Details:</div>
                            <ImageSelector podcast={podcast} setPodcast={setPodcast} />
                            <div className="border border-gray-600 rounded-md p-2 mt-2">
                                <input
                                    className="w-full bg-transparent outline-none"
                                    placeholder="Podcast Name*"
                                    type="text"
                                    value={podcast.name}
                                    onChange={(e) => setPodcast({ ...podcast, name: e.target.value })}
                                />
                            </div>
                            <div className="border border-gray-600 rounded-md p-2 mt-2">
                                <textarea
                                    className="w-full bg-transparent outline-none resize-none"
                                    placeholder="Podcast Description*"
                                    rows={5}
                                    value={podcast.desc}
                                    onChange={(e) => setPodcast({ ...podcast, desc: e.target.value })}
                                />
                            </div>
                            <div className="border border-gray-600 rounded-md p-2 mt-2">
                                <input
                                    className="w-full bg-transparent outline-none"
                                    placeholder="Tags separated by comma"
                                    type="text"
                                    value={podcast.tags.join(", ")}
                                    onChange={(e) => setPodcast({ ...podcast, tags: e.target.value.split(", ") })}
                                />
                            </div>
                            <div className="flex mt-2 gap-2">
                                <div className="w-full border border-gray-600 rounded-md p-2">
                                    <select
                                        style={{ backgroundColor: currentTheme.backgroundColor }}
                                        className="w-full bg-transparent outline-none"
                                        onChange={(e) => setPodcast({ ...podcast, type: e.target.value })}
                                    >
                                        <option value="audio">Audio</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                                <div className="w-full border border-gray-600 rounded-md p-2">
                                    <select
                                        style={{ backgroundColor: currentTheme.backgroundColor }}
                                        className="w-full bg-transparent outline-none"
                                        onChange={(e) => setPodcast({ ...podcast, category: e.target.value })}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {Category.map(category => (
                                            <option key={category.name} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mt-4 transition duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={goToAddEpisodes}
                                disabled={disabled}
                            >
                                Next
                            </button>
                        </div>
                    ) : (
                        <div style={{ backgroundColor: currentTheme.backgroundColor }} className="p-4">
                            <div className="font-semibold text-lg mb-2">Episode Details:</div>
                            {podcast.episodes.map((episode, index) => (
                                <div key={index} className="border border-gray-600 rounded-md p-2 mt-2">
                                    <label htmlFor={"fileField" + index} className="flex items-center justify-between cursor-pointer">
                                        {episode.file === "" ? (
                                            <div className="flex items-center gap-2">
                                                <BackupRounded />
                                                Select Audio/Video
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CloudDoneRounded className="text-green-500" />
                                                {episode.uploadProgress<100?"File uploading Please wait...":"File Uploaded Successfully"}
                                                
                                            </div>
)}
                                    </label>
                                    <LinearProgress
                                        className="mt-2"
                                        variant="determinate"
                                        value={podcast.episodes[index].uploadProgress}
                                        color="secondary"
                                    />
                                    <input
                                        type="file"
                                        id={"fileField" + index}
                                        className="hidden"
                                        accept="audio/*, video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const newEpisodes = [...podcast.episodes];
                                                newEpisodes[index].file = file;
                                                newEpisodes[index].uploaded = false; // Mark as not uploaded initially
                                                setPodcast({ ...podcast, episodes: newEpisodes });
                                                uploadFile(file, index);
                                            }
                                        }}
                                    />
                                    <input
                                        className="w-full bg-transparent  outline-none mt-2"
                                        placeholder="Episode Name*"
                                        type="text"
                                        value={episode.name}
                                        onChange={(e) => {
                                            const newEpisodes = [...podcast.episodes];
                                            newEpisodes[index].name = e.target.value;
                                            setPodcast({ ...podcast, episodes: newEpisodes });
                                        }}
                                    />
                                    <textarea
                                        className="w-full bg-transparent  outline-none resize-none mt-2"
                                        placeholder="Episode Description*"
                                        rows={5}
                                        value={episode.desc}
                                        onChange={(e) => {
                                            const newEpisodes = [...podcast.episodes];
                                            newEpisodes[index].desc = e.target.value;
                                            setPodcast({ ...podcast, episodes: newEpisodes });
                                        }}
                                    />
                                    <button
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg mt-2 transition duration-300"
                                        onClick={() => {
                                            const newEpisodes = podcast.episodes.filter((_, i) => i !== index);
                                            setPodcast({ ...podcast, episodes: newEpisodes });
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                            <button
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg mt-4 transition duration-300"
                                onClick={() => setPodcast({ ...podcast, episodes: [...podcast.episodes, { name: "", desc: "", file: "", uploadProgress: 0, uploaded: false }] })}
                            >
                                Add Episode
                            </button>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className={`w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ${backDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={goToPodcast}
                                    disabled={backDisabled}
                                >
                                    Back
                                </button>
                                <button
                                    className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ${createDisabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={createPodcast}
                                    disabled={createDisabled || loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        "Create"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default Upload;
