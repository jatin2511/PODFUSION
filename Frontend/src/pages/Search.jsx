import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Category } from '../utils/Data';
import { Link } from 'react-router-dom';
import Categorycard from '../components/Categorycard';

function Search() {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [searchval, setsearchval] = useState(null);
  return (
    
    <div style={{backgroundColor: currentTheme.backgroundColor}}
    className='sm:m-4 m-2 h-[90vh] rounded-xl overflow-auto'>
      <div className='flex justify-center items-center p-2 sm:p-4'>
        <div className='flex justify-start items-center w-full max-w-2xl gap-2 border-[1px] rounded-full py-1 px-3 sm:h-12'>
          <SearchOutlinedIcon />
          <input className='bg-inherit w-full focus:outline-none overflow-scroll'></input>
        </div>
      </div>

      <div className='p-2 sm:px-8'>
        {!searchval && 
        <div>
          <div className='flex justify-start py-4 sm:py-8'>
            <span className='text-xl sm:text-3xl'>Browse All</span>
          </div>
          <div className='flex flex-wrap gap-4 sm:gap-12  sm:justify-start justify-center sm:pl-24 overflow-y-hidden'>
            {Category.map((element) => (
              <Link key={element.name} to={`/showpodcasts/${element.name.toLowerCase()}`}>
                <Categorycard element={element} />
              </Link>
            ))}
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Search;