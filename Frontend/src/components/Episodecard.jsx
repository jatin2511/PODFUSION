import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { closePlayer, openPlayer } from '../redux/audioplayerSlice';
import { addView } from '../api';
import { openSnackbar } from '../redux/snackbarSlice';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const EpisodeCard = ({ episode, podcast, user, index }) => {
    
    const dispatch = useDispatch();
    const currentTheme = useSelector((state) => state.theme.currentTheme);
    const addviewtToPodcast = async () => {
        await addView(podcast._id).catch((err) => {
            dispatch(
                openSnackbar({
                    message: err.message,
                    type: "error",
                })
            );
        });
    };

    return (
        <div
        style={{backgroundColor:currentTheme.backgroundColorLight}}
            className="flex flex-row gap-5 items-center p-5 rounded-md bg-card cursor-pointer hover:translate-y-[-8px] transition-all duration-400 ease-in-out hover:shadow-md hover:brightness-125"
            onClick={async () => {
                await addviewtToPodcast();
                if (podcast.type === "audio") {
                    //open audio player
                    dispatch(
                        openPlayer({
                            type: "audio",
                            episode: episode,
                            podcast: podcast,
                            index: index,
                            currenttime: 0
                        })
                    );
                } else {
                    console.log(podcast)
                    //open video player
                    dispatch(
                        openPlayer({
                            type: "video",
                            episode: episode,
                            podcast: podcast,
                            index: index,
                            currenttime: 0
                        })
                    );
                }
            }}
        >
            <div className="relative w-32 h-32">
                <img src={episode.thumbnail || podcast.thumbnail} alt="Thumbnail" className="w-full h-full min-w-24  rounded-md object-cover bg-text_secondary" />
                <PlayCircleOutlineIcon
                  style={{height:"50px",width:"50px"}}
                    className="absolute top-[35%] left-[35%] text-white w-[100px] h-[100px]"
                />
            </div>
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center text-lg font-extrabold text-text_primary">
                    {episode.name}
                </div>
                <div className="text-sm font-medium text-text_secondary">
                    {episode.desc}
                </div>
            </div>
        </div>
    );
};

export default EpisodeCard;