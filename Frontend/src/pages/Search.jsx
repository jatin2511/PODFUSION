import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Category } from '../utils/Data';
import { Link } from 'react-router-dom';
import Categorycard from '../components/Categorycard';
import { searchPodcast } from '../api/index.js';
import { openSnackbar } from '../redux/snackbarSlice.jsx';
import { CircularProgress } from '@mui/material';
import TopResult from "../components/TopResult";
import MoreResult from "../components/MoreResult"

function Search() {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [searchval, setSearchval] = useState("");
  const [searchedPodcasts, setSearchedPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    setSearchedPodcasts([]);
    setLoading(true);
    setSearchval(e.target.value);
    try {
      const res = await searchPodcast(e.target.value);
      setSearchedPodcasts(res.data);
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{ backgroundColor: currentTheme.backgroundColor }}
      className="p-5 pb-48 h-full overflow-y-scroll flex flex-col gap-5"
    >
      <div className="flex justify-center w-full">
        <div className="max-w-lg w-full flex items-center border border-gray-300 rounded-full px-4 py-2 gap-2">
          <SearchOutlinedIcon sx={{ color: 'inherit' }} />
          <input
            type="text"
            placeholder="Search Artist/Podcast"
            className="w-full bg-transparent outline-none text-gray-700"
            value={searchval}
            onChange={handleChange}
          />
        </div>
      </div>
      {searchval === "" ? (
        <div className="mt-5">
          <div className="text-xl font-semibold mb-4">Browse All</div>
          <div className="flex flex-wrap gap-5">
            {Category.map((category) => (
              <Link
                key={category.name}
                to={`/showpodcasts/${category.name.toLowerCase()}`}
                className="text-decoration-none"
              >
                <Categorycard element={category} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-full w-full">
              <CircularProgress />
            </div>
          ) : (
            <div>
              {searchedPodcasts.length === 0 ? (
                <div className="flex justify-center items-center h-full w-full text-gray-700">
                  No Podcasts Found
                </div>
              ) : (
                <div>
                  <div className="mt-5">
                    <TopResult podcast={searchedPodcasts[0]} />
                  </div>
                  <div className="flex flex-col gap-4 h-80 overflow-y-scroll mt-5">
                    {searchedPodcasts.map((podcast) => (
                      <MoreResult key={podcast.id} podcast={podcast} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
