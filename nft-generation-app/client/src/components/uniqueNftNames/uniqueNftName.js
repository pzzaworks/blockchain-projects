import React from 'react';

export default function UniqueNftName({ uniqueNftNameIndex, uniqueNftName }) {
    return (
        <>
            <span className={uniqueNftNameIndex === 1 ? 'listSpanFirst' : 'listSpan'} ><i className='fa-solid fa-caret-right'></i> {uniqueNftName}</span>
        </>
    )
}