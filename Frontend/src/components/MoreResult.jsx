import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';

const MoreResult = ({ podcast }) => {
  return (
    <Link to={`/podcast/${podcast?._id}`} className="bg-bgLight flex items-center p-2 rounded-md gap-4 hover:shadow-lg hover:brightness-125 transition-all duration-400 ease-in-out" style={{ textDecoration: "none" }}>
      <img src={podcast?.thumbnail} alt="Podcast Thumbnail" className="h-20 w-40 object-cover rounded-md" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col text-text_primary">
          <div>{podcast?.name}</div>
        </div>
        <div className="flex gap-2">
          <div className="text-text_secondary">{podcast?.creator.name}</div>
          <div className="text-text_secondary">• {podcast?.views} Views</div>
          <div className="text-text_secondary">• {format(podcast?.createdAt)}</div>
        </div>
      </div>
    </Link>
  )
}

export default MoreResult;
