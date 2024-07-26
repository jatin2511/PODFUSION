import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { getUsers, getPodcastById } from '../api/index';
import PodcastCard from '../components/Podcard.jsx';

const Profile = () => {
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const [user, setUser] = useState(null);
    const [podcasts, setPodcasts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector(state => state.user);
    const [name, setName] = useState("");

    const token = localStorage.getItem("auth-token");

    const getUser = async () => {
        try {
            const res = await getUsers(token);
            setUser(res.data);
            setName(res.data.name);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPodcasts = async (podcastIds) => {
        try {
            const podcastPromises = podcastIds.map(id => getPodcastById(id, token));
            const podcastResponses = await Promise.all(podcastPromises);
            setPodcasts(podcastResponses.map(res => res.data));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchFavorites = async (favoriteIds) => {
        try {
            const favoritePromises = favoriteIds.map(id => getPodcastById(id, token));
            const favoriteResponses = await Promise.all(favoritePromises);
            setFavorites(favoriteResponses.map(res => res.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getUser();
        }
    }, [currentUser]);

    useEffect(() => {
        if (user) {
            fetchPodcasts(user.podcasts);
            fetchFavorites(user.favorits).then(() => setLoading(false));
        }
    }, [user]);

    return (
        <div 
        style={{backgroundColor: currentTheme.backgroundColor}}
        className="p-5 m-3 rounded-xl pb-52 h-full overflow-y-scroll flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
                <div>
                    <Avatar sx={{ height: 165, width: 165, fontSize: '24px' }} src={currentUser?.picture}>
                        {currentUser?.name.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
                <div className="flex flex-col justify-center items-center md:items-start">
                    <div className="text-primary text-3xl font-semibold">
                        {currentUser?.name}
                    </div>
                    <div className="text-blue-600 text-sm font-normal">
                        Email: {currentUser?.email}
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <CircularProgress />
                </div>
            ) : (
                <>
                    {currentUser && podcasts.length > 0 && (
                        <div className="bg-background rounded-xl p-6 flex flex-col gap-5">
                            <div className="text-primary text-2xl font-semibold">
                                Your Uploads
                            </div>
                            <div className="flex flex-wrap gap-4 justify-start md:justify-start">
                                {podcasts.map((podcast) => (
                                    <PodcastCard key={podcast._id} podcast={podcast} user={user} />
                                ))}
                            </div>
                        </div>
                    )}
                    {currentUser && podcasts.length === 0 && (
                        <div className="bg-background rounded-xl p-6 flex flex-col gap-5">
                            <div className="text-primary text-2xl font-semibold">
                                Your Uploads
                            </div>
                            <div className="flex justify-center items-center">
                                <button className="text-primary border border-primary rounded-xl px-4 py-2 flex items-center justify-center gap-2 hover:bg-primary hover:text-background transition-colors">
                                    Upload
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="bg-background rounded-xl p-6 flex flex-col gap-5">
                        <div className="text-primary text-2xl font-semibold">
                            Your Favourites
                        </div>
                        <div className="flex flex-wrap gap-4 justify-start md:justify-start">
                            {favorites.map((podcast) => (
                                <PodcastCard key={podcast._id} podcast={podcast} user={user} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Profile;
