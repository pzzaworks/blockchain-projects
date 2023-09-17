import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Fetching() {
  const contractAddress = "0x2648e6BC01AA3aE8a8194118Fa5d7FE550a0eb98";

  return (
    <>
        <div className='fetching'>
            <p>Canvas data is fetching from our </p> 
            <a href={'https://snowtrace.io/address/' + contractAddress} rel="noreferrer" target='_blank'> smart contract. </a>
            <FontAwesomeIcon icon="fa-solid fa-circle-half-stroke" className='fa-spin'/>
        </div>
    </>
  )
}

export default Fetching;
