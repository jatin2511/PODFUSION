import { CloseRounded } from '@mui/icons-material';
import { Modal } from '@mui/material';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { closePlayer, openPlayer, setCurrentTime } from '../redux/audioplayerSlice';
import { openSnackbar } from '../redux/snackbarSlice';

const VideoPlayer = ({ episode, podcast, currenttime, index }) => {
  const dispatch = useDispatch();
  const videoref = useRef(null);
  const handleTimeUpdate = () => {
    const currentTime = videoref.current.currentTime;
    dispatch(setCurrentTime({ currenttime: currentTime }));
  };

  const goToNextPodcast = () => {
    if (podcast.episodes.length === index + 1) {
      dispatch(
        openSnackbar({
          message: 'This is the last episode',
          severity: 'info',
        })
      );
      return;
    }

    dispatch(closePlayer());
    setTimeout(() => {
      dispatch(
        openPlayer({
          type: 'video',
          podcast: podcast,
          index: index + 1,
          currenttime: 0,
          episode: podcast.episodes[index + 1],
        })
      );
    }, 10);
  };

  const goToPreviousPodcast = () => {
    if (index === 0) {
      dispatch(
        openSnackbar({
          message: 'This is the first episode',
          severity: 'info',
        })
      );
      return;
    }
    dispatch(closePlayer());
    setTimeout(() => {
      dispatch(
        openPlayer({
          type: 'video',
          podcast: podcast,
          index: index - 1,
          currenttime: 0,
          episode: podcast.episodes[index - 1],
        })
      );
    }, 10);
  };

  return (
    <Modal open={true} onClose={() => dispatch(closePlayer())}>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 overflow-y-scroll transition-all ease-in-out duration-500">
        <div className="max-w-screen-md w-full bg-gray-800 text-gray-200 rounded-lg m-10 overflow-hidden flex flex-col relative">
          <CloseRounded
            className="absolute top-2 right-4 cursor-pointer"
            onClick={() => dispatch(closePlayer())}
          />
          <video
            className="h-full max-h-96 w-full object-cover rounded-xl px-8 mt-10"
            controls
            ref={videoref}
            onTimeUpdate={handleTimeUpdate}
            onEnded={goToNextPodcast}
            autoPlay
            onPlay={() => {
              videoref.current.currentTime = currenttime;
            }}
          >
            <source src={episode.file} type="video/mp4" />
            <source src={episode.file} type="video/webm" />
            <source src={episode.file} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          <div className="text-xl font-semibold text-white m-4">{episode.name}</div>
          <div className="text-sm font-normal text-gray-400 m-4">{episode.desc}</div>
          <div className="flex justify-between m-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              onClick={goToPreviousPodcast}
            >
              Previous
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              onClick={goToNextPodcast}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VideoPlayer;