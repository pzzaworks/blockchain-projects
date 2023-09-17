import React from 'react';

export default function ProgressBar({ progress, progressBarOpacity }) {

    return (
        <>
            <div className='progressBarDiv'>
                <div className='progressBar' style={{ width: progress + '%', opacity: progressBarOpacity }}></div>
            </div>
        </>
    )
}