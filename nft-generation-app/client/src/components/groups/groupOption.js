import React from 'react';

export default function GroupOption({ groupName }) {
    return (
        <>
            <option value={groupName}>{groupName}</option>
        </>
    )
}