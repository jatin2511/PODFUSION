import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';
import classNames from 'classnames';

const SearchedCard = ({ podcast }) => {
  return (
    <Link
      to={`/podcast/${podcast?._id}`}
      className={classNames(
        'w-full',
        'max-w-md',
        'flex',
        'flex-col',
        'p-4',
        'rounded-lg',
        'gap-3',
        'shadow-md',
        'hover:shadow-lg',
        'transition-transform',
        'transform',
        'hover:-translate-y-2',
        'hover:filter',
        'hover:brightness-125',
      )}
    >
      <img
        src={podcast?.thumbnail}
        alt="Podcast Thumbnail"
        className="object-cover w-1/2 rounded-lg shadow-md"
      />
      <div className="text-primary text-xl font-semibold">{podcast?.name}</div>
      <div className="flex items-center gap-3">
        <div className="text-secondary text-sm">{`• ${podcast.views} Views`}</div>
        <div className="text-secondary text-sm">{`• ${format(podcast?.createdAt)}`}</div>
        <div className="text-primary text-sm ml-3">{podcast?.creator.name}</div>
      </div>
      <div className="text-secondary text-sm truncate">{podcast?.desc}</div>
    </Link>
  );
};

export default SearchedCard;