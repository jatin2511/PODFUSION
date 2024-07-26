import React, { useState, useEffect } from 'react';
import { Avatar} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { favoritePodcast } from '../api';
import { openSignin } from '../redux/setsigninSlice';

const PodcastCard = ({ podcast, user, setSignInOpen }) => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [favourite, setFavourite] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const token = localStorage.getItem("auth-token");

  const favoritpodcast = async () => {
    await favoritePodcast(podcast._id, token)
      .then((res) => {
        if (res.status === 200) {
          setFavourite(!favourite);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (user?.favorits?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true);
    }
  }, [user, podcast._id]);

  return (
    <Link
      to={`/podcast/${podcast._id}`}
      style={{backgroundColor: currentTheme.card}}
      className="relative  max-w-xs h-72 flex flex-col justify-start items-center p-4 rounded-lg shadow-md hover:cursor-pointer hover:-translate-y-2 transition-all duration-400 ease-in-out hover:shadow-lg hover:brightness-125 "
    >
      <div className="flex flex-col items-center w-full ">
        <div className="relative flex justify-center items-center h-36 w-full">
          <div
            onClick={(e) => {
              e.preventDefault();
              if (!currentUser) {
                dispatch(openSignin());
              } else {
                favoritpodcast();
              }
            }}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-gray-200 backdrop-blur-sm shadow-lg"
          >
            <FavoriteIcon style={{ color: favourite ? "#E30022" : "gray" }} />
          </div>
          <img
            src={podcast.thumbnail}
            alt={podcast.name}
            className="object-cover w-full h-full rounded-lg shadow-lg hover:shadow-2xl"
          />
          <div className="absolute top-1/2 right-1/4 hidden p-2 rounded-full bg-purple-600 text-white backdrop-blur-sm shadow-md transition-all duration-400 ease-in-out">
            {podcast?.type === 'video' ? (
              <PlayArrowIcon className="w-7 h-7" />
            ) : (
              <HeadphonesIcon className="w-7 h-7" />
            )}
          </div>
        </div>
        <div className="flex flex-col w-full items-start pt-4">
          <div className="font-semibold text-lg overflow-hidden line-clamp-2">
            {podcast.name}
          </div>
          <div className="text-sm text-gray-600 overflow-hidden line-clamp-2">
            {podcast.desc}
          </div>
          <div className="flex justify-between items-center w-full mt-2 gap-2">
            <div className="flex items-center gap-2">
              <Avatar src={podcast.creator?.img} className="w-6 h-6">
                {podcast.creator?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div className="text-xs text-gray-600">
                {podcast.creator?.name}
              </div>
            </div>
            <div className="text-xs text-gray-600">
              • {podcast.views} Views
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;

