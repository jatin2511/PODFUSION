import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Podcard from '../components/Podcard';
import { getUsers, getPodcastById } from '../api/index';
import { CircularProgress } from '@mui/material';

const Favourites = () => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const token = localStorage.getItem("auth-token");

  const getUser = async () => {
    try {
      const res = await getUsers(token);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFavourites = async () => {
    if (user?.favorits) {
      const favPromises = user.favorits.map(id => getPodcastById(id));
      const favResults = await Promise.all(favPromises);
      setFavourites(favResults.map(res => res.data));
    }
  };

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getUser().then(() => {
        fetchFavourites().finally(() => setLoading(false));
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchFavourites().finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div
    style={{backgroundColor:currentTheme.backgroundColor}}
    className="p-5 m-3 pb-52 h-full rounded-xl overflow-y-scroll flex flex-col gap-5 ">
      <div className="text-primary text-xl font-semibold flex justify-between items-center">
        Favourites
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 p-4">
          {favourites.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full text-primary">
              No Favourites
            </div>
          ) : (
            favourites.map(podcast => (
              <Podcard key={podcast.id} podcast={podcast} user={user} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Favourites;
