import React from 'react';
import Round from './round';

export default function RoundProperties({ currentProperties, rounds, setRounds }) {
    let currentRound = '';

    if(currentProperties.split('round')[1] !== undefined && currentProperties.split('round')[1] !== 's') {
        currentRound = 'Round ' + currentProperties.split('round')[1] + ' Properties';
    }

    return (
        <>
            {currentProperties.split('round')[1] !== undefined && currentProperties.split('round')[1] !== 's' ? (
                <>
                    <h2><i className="fa-solid fa-list-ol"></i> {currentRound}</h2>
                    <div className='line'></div>
                    <Round roundIndex={parseInt(currentProperties.split('round')[1]) - 1} rounds={rounds} setRounds={setRounds}/>
                </>
            ) : (<></>)}
        </>
    )
}