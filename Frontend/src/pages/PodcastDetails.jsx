import React, { useState, useEffect } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CircularProgress, IconButton, Avatar } from '@mui/material';
import { favoritePodcast, getPodcastById, getUsers } from '../api';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Episodecard from '../components/Episodecard';
import { openSnackbar } from '../redux/snackbarSlice';
import { format } from 'timeago.js';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HeadphonesIcon from '@mui/icons-material/Headphones';

const PodcastDetails = () => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const { id } = useParams();
  const [favourite, setFavourite] = useState(false);
  const [podcast, setPodcast] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const token = localStorage.getItem("auth-token");
  const { currentUser } = useSelector(state => state.user);

  const favoritpodcast = async () => {
    if (podcast) {
      setLoading(true);
      try {
        const res = await favoritePodcast(podcast._id, token);
        if (res.status === 200) {
          setFavourite(!favourite);
        }
      } catch (err) {
        console.log(err);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    }
  };

  const getUser = async () => {
    try {
      const res = await getUsers(token);
      setUser(res.data);
    } catch (err) {
      console.log(err);
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    }
  };

  const getPodcast = async () => {
    setLoading(true);
    try {
      const res = await getPodcastById(id);
      
      if (res.status === 200) {
        setPodcast(res.data);
      }
    } catch (err) {
      console.log(err);
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPodcast();
  }, [id]);

  useEffect(() => {
    if (currentUser) {
      getUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (user?.favorits?.find((fav) => fav._id === podcast?._id)) {
      setFavourite(true);
    }
  }, [user, podcast]);

  return (
    <div
      style={{ backgroundColor: currentTheme.backgroundColor }}
      className="p-5 m-3 rounded-xl pb-52 h-full overflow-y-scroll flex flex-col gap-5"
    >
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="flex justify-end w-full">
            <IconButton
              onClick={favoritpodcast}
              
            >
              <FavoriteIcon 
              className={`${
                favourite ? 'text-red-500' : 'text-primary'
              } bg-secondary rounded-full`}
               />
            </IconButton>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <img
              src={podcast?.thumbnail}
              alt={podcast?.name}
              className="w-64 h-64 rounded-md object-cover bg-secondary"
            />
            <div className="flex flex-col gap-3 w-full">
              <div className="text-3xl font-bold text-primary flex justify-between">
                {podcast?.name}
              </div>
              <div className="text-sm font-medium text-secondary">
                {podcast?.desc}
              </div>
              <div className="flex flex-wrap gap-2">
                {podcast?.tags.map((tag) => (
                  <div key={tag} className="bg-secondary text-primary px-3 py-1 rounded-full text-xs">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={podcast?.creator?.img} sx={{ width: 26, height: 26 }}>
                  {podcast?.creator?.name.charAt(0).toUpperCase()}
                </Avatar>
                <div className="text-secondary text-xs">{podcast?.creator?.name}</div>
                <div className="text-secondary text-xs ml-5">• {podcast?.views} Views</div>
                <div className="text-secondary text-xs ml-5">• {format(podcast?.createdAt)}</div>
                <div className="bg-purple-600 text-white rounded-full flex items-center justify-center p-2 ml-5">
                  {podcast?.type === 'audio' ? <HeadphonesIcon /> : <PlayArrowIcon />}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-xl font-semibold text-primary">All Episodes</div>
            <div className="flex flex-col gap-5">
              {podcast?.episodes.map((episode, index) => (
                <Episodecard
                  key={episode._id}
                  episode={episode}
                  podcast={podcast}
                  user={user}
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PodcastDetails;
