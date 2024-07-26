import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { openSignin } from '../redux/setsigninSlice';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom'; 

function Navbar({ sidebarvisibility, setsidebarvisibility }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  return (
    <div className={`flex ${!sidebarvisibility ? 'justify-between' : 'justify-end'} pt-3 px-8 items-center h-[8vh] shadow-lg`}>
      {!sidebarvisibility && <MenuIcon onClick={() => { setsidebarvisibility(true) }} className='cursor-pointer' />}
      {!currentUser ? (<button className='flex gap-1 sm:gap-4 items-center border-purple-700 border-[1px] py-1 px-1.5 sm:p-2 rounded-xl text-purple-500 sm:text-xl text-sm' onClick={() => dispatch(openSignin())}>
        <PersonIcon />
        <span>Login</span>
      </button>):(
          <Link to='/profile' className='flex items-center gap-4 text-xl text-purple-500'  style={{ textDecoration: 'none' }}>
            <div className='hidden sm:block'>Welcome, {currentUser.name}</div>
            <Avatar src={currentUser.picture}>{currentUser.name.charAt(0).toUpperCase()}</Avatar>
          </Link>
        ) }
    </div>
  );
}

export default Navbar;