import React, { useState, useEffect, useRef } from 'react';
import "./Message.css";

const LoadMore = ({ deckID }) => {   
    const [offset, setOffset] = useState(25);
    const [loader, setLoader] = useState(false);
    const deckOffsets = useRef({});

    const loadMoreMessage = async (deckID, offset) => {
        if (!deckOffsets.current[deckID]) {
            deckOffsets.current[deckID] = 25;
        } else {
            deckOffsets.current[deckID] += 25;
        }

        setLoader(true);
        await window.electron.ipcRenderer.discordBot.loadMoreMessages(deckID, deckOffsets.current[deckID].toString());
        setLoader(false);
    };

    useEffect(() => {
        if (deckOffsets.current[deckID]) {
            setOffset(deckOffsets.current[deckID]);
        } else {
            setOffset(25);
            deckOffsets.current[deckID] = 25;
        }
    }, [deckID]);

    return (
        <div>
            {loader ? (
                <p className='Load-more-button'>Loading...</p>
            ) : (
                <button className='Load-more-button' onClick={() => loadMoreMessage(deckID, offset)}>
                    Load More
                </button>
            )}
        </div>
    );
};

export default LoadMore;
