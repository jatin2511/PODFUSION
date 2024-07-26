import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPodcastByCategory, getMostPopularPodcast } from '../api/index.js';
import PodcastCard from '../components/Podcard.jsx';
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlice";
import { CircularProgress } from '@mui/material';

const DisplayPodcast = () => {
    const { type } = useParams();
    const [podcasts, setPodcasts] = useState([]);
    const [string, setString] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const mostPopular = async () => {
        await getMostPopularPodcast()
            .then((res) => {
                setPodcasts(res.data);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            });
    };

    const getCategory = async () => {
        await getPodcastByCategory(type)
            .then((res) => {
                setPodcasts(res.data);
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            });
    };

    const getAllPodcasts = async () => {
        setLoading(true);
        let arr = type.split("");
        arr[0] = arr[0].toUpperCase();
        
        if (type === 'mostpopular') {
            arr.splice(4, 0, " ");
            setString(arr.join(""));
            await mostPopular();
        } else {
            setString(arr.join(""));
            await getCategory();
        }
        setLoading(false);
    };

    useEffect(() => {
        getAllPodcasts();
    }, [type]);

    return (
        <div  className="flex flex-col h-full overflow-y-scroll p-6">
            <div className="bg-primary-light p-5 rounded-md min-h-[400px]">
                <div className="text-primary text-xl font-semibold flex justify-between items-center">
                    {string}
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 py-6">
                        {podcasts.length === 0 && (
                            <div className="flex justify-center items-center h-full w-full text-primary">
                                No Podcasts
                            </div>
                        )}
                        {podcasts.map((podcast) => (
                            <PodcastCard key={podcast.id} podcast={podcast} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
 
export default DisplayPodcast;