import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from "../redux/userSlice";
import { openSignin } from '../redux/setsigninSlice';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import HeadsetIcon from '@mui/icons-material/Headset';
import CloseIcon from '@mui/icons-material/Close';

function Sidebar({ darkMode, setDarkMode, setsidebarvisibility, setUploadOpen}) {
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const toggleTheme = () => {
        console.log('Toggling theme');
        setDarkMode(prevMode => !prevMode);
    };

    const logoutUser = () => {
        console.log('Logging out');
        dispatch(logout());
        navigate(`/`);
    };

    const handleUploadClick = () => {
        console.log('Upload button clicked');
        if (currentUser) {
            setUploadOpen(true);
        } else {
            dispatch(openSignin());
        }
    };

    const handleFavouritesClick = () => {
        console.log('Favourites button clicked');
        if (!currentUser) {
            dispatch(openSignin());
        }
    };

    const handleLoginClick = () => {
        console.log('Login button clicked');
        dispatch(openSignin());
    };

    return (
        <div
        style={{backgroundColor:currentTheme.backgroundColor}}
        className='w-max h-full fixed z-20 flex flex-col pt-8 sm:text-2xl text-sm '>
            <div className='pl-4 xs:pl-8 flex justify-between items-center gap-3 pb-4 '>
                <div className='flex items-center gap-1 sm:gap-2 text-purple-600'>
                    <HeadsetIcon className='' />
                    <span className='font-bold sm:text-3xl text-lg'>PodFusion</span>
                </div>
                <CloseIcon onClick={() => { setsidebarvisibility(false) }} className='cursor-pointer' />
            </div>

            <Link to="/" className="px-4 sm:px-8 flex items-center py-4 hover:bg-[#b1b2b3]">
                <HomeIcon className="mr-2" />
                <div>Dashboard</div>
            </Link>

            <Link to="/search" className="px-4 sm:px-8 flex items-center py-4 hover:bg-[#b1b2b3]">
                <SearchIcon className="mr-2" />
                <div>Search</div>
            </Link>

            {currentUser ? (
                <Link to="/favourites" className="px-4 sm:px-8 flex items-center py-4 hover:bg-[#b1b2b3]">
                    <FavoriteIcon className="mr-2" />
                    <div>Favourites</div>
                </Link>
            ) : (
                <div onClick={handleFavouritesClick} className="px-4 sm:px-8 flex items-center py-4 cursor-pointer hover:bg-[#b1b2b3]">
                    <FavoriteIcon className="mr-2" />
                    <div>Favourites</div>
                </div>
            )}

            <hr className='border-[#606061] w-full my-3'></hr>

            <div onClick={handleUploadClick} className="px-4 sm:px-8 flex items-center py-4 cursor-pointer hover:bg-[#b1b2b3]">
                <CloudUploadIcon className="mr-2" />
                <div>Upload</div>
            </div>

            <div onClick={toggleTheme} className="px-4 sm:px-8 flex items-center py-4 cursor-pointer hover:bg-[#b1b2b3]">
                {darkMode ? <LightModeIcon className="mr-2" /> : <DarkModeIcon className="mr-2" />}
                <div>{darkMode ? 'Light Mode' : 'Dark Mode'}</div>
            </div>

            {currentUser ? (
                <div onClick={logoutUser} className="px-4 sm:px-8 flex items-center py-4 cursor-pointer hover:bg-[#b1b2b3]">
                    <ExitToAppIcon className="mr-2" />
                    <div>Log Out</div>
                </div>
            ) : (
                <div onClick={handleLoginClick} className="px-4 sm:px-8 flex items-center py-4 cursor-pointer hover:bg-[#b1b2b3]">
                    <ExitToAppIcon className="mr-2" />
                    <div>Log In</div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;