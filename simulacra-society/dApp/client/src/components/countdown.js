import React from 'react';

function Countdown ({countdownDays, countdownHours, countdownMinutes, countdownSeconds}) {
    return (
        <ul>
            <li><span>{countdownDays}</span><p>Days</p></li>
            <li><span>{countdownHours}</span><p>Hours</p></li>
            <li><span>{countdownMinutes}</span><p>Minutes</p></li>
            <li><span>{countdownSeconds}</span><p>Seconds</p></li>
        </ul>
    );
};

Countdown.defaultProps = {
    countdownDays: 0,
    countdownHours: 0,
    countdownMinutes: 0,
    countdownSeconds: 0,
}

export default Countdown;


