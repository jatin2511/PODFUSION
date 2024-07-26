import React from 'react';
import Avatar from '@mui/material/Avatar';

const SearchCard = () => {
  return (
    <div className="h-64 w-64 bg-green-600 p-4 rounded-lg">
      <Avatar
        src="https://imgs.search.brave.com/ehz2Uo5e7s5vqThA4x8MHLLd-td3CpvouiLDGFQnVJg/rs:fit:500:500:1/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTAwMDE5/NzA4ODg4My11emcz/YWEtdDUwMHg1MDAu/anBn"
        alt="Eminem picture"
        sx={{ width: '100px', height: '100px' }}
      />
      <div className="text-primary font-semibold text-2xl mt-4">Eminem</div>
      <div className="text-secondary mt-3">Hello I am Eminem</div>
    </div>
  );
};

export default SearchCard;