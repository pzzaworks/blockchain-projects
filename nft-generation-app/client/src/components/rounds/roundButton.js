import React from 'react';

export default function RoundButton({ roundIndex, currentSubMenu, setCurrentSubMenu }) {
    let currentRound = 'Round ' + roundIndex.toString();
    let currentSubMenuRound = 'round' + roundIndex.toString();

    return (
        <>
            <button className={currentSubMenu === currentSubMenuRound ? 'activatedSubLeftBarDivButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentSubMenu(currentSubMenuRound);}}>
                <span>{currentRound}</span>
            </button>
        </>
    )
}