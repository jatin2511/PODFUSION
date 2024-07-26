import { SkipNextRounded, SkipPreviousRounded, VolumeUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { closePlayer, openPlayer, setCurrentTime } from '../redux/audioplayerSlice';
import { openSnackbar } from '../redux/snackbarSlice';

const AudioPlayer = ({ episode, podid, currenttime, index }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progressWidth, setProgressWidth] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    const handleTimeUpdate = () => {
        const duration = audioRef.current.duration;
        const currentTime = audioRef.current.currentTime;
        const progress = (currentTime / duration) * 100;
        setProgressWidth(progress);
        setDuration(duration);
        dispatch(
            setCurrentTime({
                currenttime: currentTime
            })
        );
    };

    const handleVolumeChange = (event) => {
        const volume = event.target.value;
        setVolume(volume);
        audioRef.current.volume = volume;
    };

    const goToNextPodcast = () => {
        if (podid.episodes.length === index + 1) {
            dispatch(
                openSnackbar({
                    message: "This is the last episode",
                    severity: "info",
                })
            );
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "audio",
                    podid: podid,
                    index: index + 1,
                    currenttime: 0,
                    episode: podid.episodes[index + 1]
                })
            );
        }, 10);
    };

    const goToPreviousPodcast = () => {
        if (index === 0) {
            dispatch(
                openSnackbar({
                    message: "This is the first episode",
                    severity: "info",
                })
            );
            return;
        }
        dispatch(closePlayer());
        setTimeout(() => {
            dispatch(
                openPlayer({
                    type: "audio",
                    podid: podid,
                    index: index - 1,
                    currenttime: 0,
                    episode: podid.episodes[index - 1]
                })
            );
        }, 10);
    };

    return (
        <div className="flex items-center justify-between h-16 w-full bg-card text-white fixed bottom-0 left-0 p-2 transition-all duration-500 z-50">
            <div className="flex items-center gap-5 ml-5 flex-1">
                <img src={podid?.thumbnail} alt="Thumbnail" className="w-15 h-15 rounded-md object-cover" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium truncate">{episode?.name}</span>
                    <span className="text-xs mt-1">{episode?.creator.name}</span>
                </div>
            </div>
            <div className="flex flex-col items-center justify-between flex-1 max-w-xl gap-2">
                <div className="flex items-center gap-8">
                    <IconButton className="bg-text_primary text-bg !text-4xl !p-2 md:!text-2xl md:!p-1" onClick={goToPreviousPodcast}>
                        <SkipPreviousRounded />
                    </IconButton>
                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={goToNextPodcast}
                        autoPlay
                        controls
                        onPlay={() => { audioRef.current.currentTime = currenttime }}
                        src={episode?.file}
                        className="h-12 w-full text-xs md:h-10 md:text-[10px]"
                    />
                    <IconButton className="bg-text_primary text-bg !text-4xl !p-2 md:!text-2xl md:!p-1" onClick={goToNextPodcast}>
                        <SkipNextRounded />
                    </IconButton>
                </div>
            </div>
            <div className="flex items-center gap-2 w-1/4 max-w-xs justify-between mr-5  md:flex">
                <VolumeUp />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="appearance-none w-full h-1 rounded-lg bg-text_primary outline-none"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;