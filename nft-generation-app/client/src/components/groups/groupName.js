import React from 'react';

export default function GroupName({ groupIndex, groupName }) {
    return (
        <>
            <span className={groupIndex === 1 ? 'listSpanFirst' : 'listSpan'}><i className='fa-solid fa-caret-right'></i> {groupName}</span>
        </>
    )
}