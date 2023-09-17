import React from 'react';

function Countdown ({countdownDays, countdownHours, countdownMinutes, countdownSeconds}) {
    return (
        <>
            <span className='highlight'>Painting will stop in</span>
            <br/>
            <p>{countdownDays} Days {countdownHours} Hours {countdownMinutes} Minutes {countdownSeconds} Seconds</p>
        </>
    );
};

Countdown.defaultProps = {
    countdownDays: 0,
    countdownHours: 0,
    countdownMinutes: 0,
    countdownSeconds: 0,
}

export default Countdown;


