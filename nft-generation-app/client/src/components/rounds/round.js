import React from 'react';

export default function Round({ roundIndex, rounds, setRounds }) {
    function setRoundUniqueItemCount(value) {
        let newRounds = [...rounds];
        newRounds[roundIndex].unique = value;
        setRounds(newRounds);
    }    

    function setRoundLegendItemCount(value) {
        let newRounds = [...rounds];
        newRounds[roundIndex].legend = value;
        setRounds(newRounds);
    }    

    function setRoundEpicItemCount(value) {
        let newRounds = [...rounds];
        newRounds[roundIndex].epic = value;
        setRounds(newRounds);
    }    

    function setRoundRareItemCount(value) {
        let newRounds = [...rounds];
        newRounds[roundIndex].rare = value;
        setRounds(newRounds);
    }    

    function setRoundCommonItemCount(value) {
        let newRounds = [...rounds];
        newRounds[roundIndex].common = value;
        setRounds(newRounds);
    }    

    return (
        <>
            <span>Unique Item Count</span>
            <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setRoundUniqueItemCount(e.target.value); }} value={rounds[roundIndex].unique}/>
            <span>Legend Item Count</span>
            <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setRoundLegendItemCount(e.target.value); }} value={rounds[roundIndex].legend}/>
            <span>Epic Item Count</span>
            <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setRoundEpicItemCount(e.target.value); }} value={rounds[roundIndex].epic}/>
            <span>Rare Item Count</span>
            <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setRoundRareItemCount(e.target.value); }} value={rounds[roundIndex].rare}/>
            <span>Common Item Count</span>
            <input autoComplete='off' type='number' min='0' onChange={(e) => { e.preventDefault(); setRoundCommonItemCount(e.target.value); }} value={rounds[roundIndex].common}/>
            <br/>
        </>
    )
}