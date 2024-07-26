import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { closeSignin, openSignin } from "./redux/setsigninSlice";
import { darkTheme, lightTheme } from './utils/Themes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ToastMessage from './components/ToastMessage';
import Search from './pages/Search';
import Favourites from './pages/Favourites';
import Profile from './pages/Profile';
import DisplayPodcast from './pages/DisplayPodcast';
import PodcastDetails from './pages/PodcastDetails';
import AudioPlayer from "./components/AudioPlayer";
import VideoPlayer from "./components/VideoPlayer";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Upload from './components/Upload';
import { setTheme } from './redux/themeSlice';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [sidebarVisibility, setSidebarVisibility] = useState(false);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const { openplayer, type, episode, podcast, currenttime, index } = useSelector((state) => state.audioplayer);
  const { open: opensi } = useSelector((state) => state.signin);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const theme = darkMode ? darkTheme : lightTheme;
    dispatch(setTheme(theme));
  }, [darkMode, dispatch]);




  const handleSignInClose = () => {
    dispatch(closeSignin());
  };

  return (
    <Router>
      <div  style={{  ...currentTheme,backgroundColor: currentTheme.backgroundColorLight,height: '100vh', width: '100%', display: 'flex', overflow: 'hidden' }}>
        {sidebarVisibility && <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} setsidebarvisibility={setSidebarVisibility} setUploadOpen={setUploadOpen}/>}
        <div style={{ width: '100%', height: '100%' }}>
          {opensi && (
            <SignIn
              signInOpen={opensi}
              setSignInOpen={handleSignInClose}
              setSignUpOpen={() => setSignUpOpen(true)}
            />
          )}
          {signUpOpen && <SignUp setSignInOpen={() => dispatch(openSignin())} setSignUpOpen={setSignUpOpen} />}
          {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
          {openplayer && (type === 'video' ? 
            <VideoPlayer episode={episode} podcast={podcast} currenttime={currenttime} index={index} /> : 
            <AudioPlayer episode={episode} podcast={podcast} currenttime={currenttime} index={index} />
          )}
          <Navbar sidebarvisibility={sidebarVisibility} setsidebarvisibility={setSidebarVisibility} />
          <Routes>
            <Route path='/' element={<Dashboard setSignInOpen={() => dispatch(openSignin())} />} />
            <Route path='/search' element={<Search />} />
            <Route path='/favourites' element={<Favourites />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/podcast/:id' element={<PodcastDetails />} />
            <Route path='/showpodcasts/:type' element={<DisplayPodcast />} />
          </Routes>
          {open && <ToastMessage open={open} message={message} severity={severity} />}
        </div>
      </div>
    </Router>
  );
}

export default App;