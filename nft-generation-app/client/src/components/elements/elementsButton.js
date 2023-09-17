import React from 'react';

export default function ElementsButton({ elementCount, currentSubSubMenu, setCurrentSubSubMenu }) {
    let elementButtonList = [];

    for (var elementIndex = 0; elementIndex < elementCount; elementIndex++) {
        elementButtonList.push(elementIndex);
    }

    return (
        <>
            {elementButtonList.map((elementButton, elementButtonIndex) => (
                <div key={'elementButton' + elementButtonIndex}>
                    <button className={currentSubSubMenu === 'element' + (elementButtonIndex + 1).toString() ? 'activatedSubSubLeftBarDivButton' : ''} onClick={(e) => { e.preventDefault(); setCurrentSubSubMenu('element' + (elementButtonIndex + 1).toString());}}>
                        <span>{'Element ' + (elementButtonIndex + 1).toString()}</span>
                    </button>
                </div> 
            ))}
        </>
    )
}