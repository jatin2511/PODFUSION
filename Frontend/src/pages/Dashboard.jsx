import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getMostPopularPodcast, getPodcastByCategory, getUsers, getPodcastById } from '../api/index';
import Podcard from '../components/Podcard';

const Dashboard = ({ setSignInOpen }) => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [mostPopular, setMostPopular] = useState([]);
  const [user, setUser] = useState();
  const [comedy, setComedy] = useState([]);
  const [news, setNews] = useState([]);
  const [sports, setSports] = useState([]);
  const [crime, setCrime] = useState([]);
  const [userPodcasts, setUserPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector(state => state.user);

  const token = localStorage.getItem("auth-token");

  const getUser = async () => {
    try {
      const res = await getUsers(token);
      setUser(res.data);
      if (res.data.podcasts) {
        const podcastPromises = res.data.podcasts.map(id => getPodcastById(id));
        const podcastResults = await Promise.all(podcastPromises);
        setUserPodcasts(podcastResults.map(res => res.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPopularPodcast = async () => {
    try {
      const res = await getMostPopularPodcast();
      setMostPopular(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getComedyPodcasts = async () => {
    try {
      const res = await getPodcastByCategory("comedy");
      setComedy(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getNewsPodcasts = async () => {
    try {
      const res = await getPodcastByCategory("news");
      setNews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSportsPodcasts = async () => {
    try {
      const res = await getPodcastByCategory("sports");
      setSports(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCrimePodcasts = async () => {
    try {
      const res = await getPodcastByCategory("crime");
      setCrime(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllData = async () => {
    setLoading(true);
    if (currentUser) {
      await getUser();
    }
    await getPopularPodcast();
    await getComedyPodcasts();
    await getNewsPodcasts();
    await getCrimePodcasts();
    await getSportsPodcasts();
    setLoading(false);
  };

  useEffect(() => {
    getAllData();
  }, [currentUser]);

  return (
    <div     className="flex flex-col h-[90vh] m-3 sm:m-4 overflow-y-auto gap-4 rounded-xl ">
      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress />
        </div>
      ) : (
        <>
          {currentUser && userPodcasts.length > 0 && (
            <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
              <div className="flex justify-between items-center px-4 sm:px-8 py-4">
                <span className="text-xl sm:text-2xl font-semibold">Your Uploads</span>
                <Link to="/profile">
                  <span className="text-purple-500 text-sm sm:text-xl">Show All</span>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
                {userPodcasts.slice(0, 10).map(podcast => (
                  <Podcard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            </div>
          )}
          <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
            <div className="flex justify-between items-center px-4 sm:px-8 py-4">
              <span className="text-xl sm:text-2xl font-semibold">Most Popular</span>
              <Link to="/showpodcasts/mostpopular">
                <span className="text-purple-500 text-sm sm:text-xl">Show All</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
              {mostPopular.slice(0, 10).map(podcast => (
                <Podcard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
          <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
            <div className="flex justify-between items-center px-8 py-4">
              <span className="text-xl sm:text-2xl font-semibold">Comedy</span>
              <Link to="/showpodcasts/comedy">
                <span className="text-purple-500 text-lg sm:text-xl">Show All</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
              {comedy.slice(0, 10).map(podcast => (
                <Podcard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
          <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
            <div className="flex justify-between items-center px-8 py-4">
              <span className="text-xl sm:text-2xl font-semibold">News</span>
              <Link to="/showpodcasts/news">
                <span className="text-purple-500 text-lg sm:text-xl">Show All</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
              {news.slice(0, 10).map(podcast => (
                <Podcard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
          <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
            <div className="flex justify-between items-center px-8 py-4">
              <span className="text-xl sm:text-2xl font-semibold">Crime</span>
              <Link to="/showpodcasts/crime">
                <span className="text-purple-500 text-lg sm:text-xl">Show All</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
              {crime.slice(0, 10).map(podcast => (
                <Podcard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
          <div style={{backgroundColor: currentTheme.backgroundColor}} className="pb-10  rounded-xl">
            <div className="flex justify-between items-center px-8 py-4">
              <span className="text-xl sm:text-2xl font-semibold">Sports</span>
              <Link to="/showpodcasts/sports">
                <span className="text-purple-500 text-lg sm:text-xl">Show All</span>
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 py-4 sm:pl-24 justify-center sm:justify-start">
              {sports.slice(0, 10).map(podcast => (
                <Podcard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;