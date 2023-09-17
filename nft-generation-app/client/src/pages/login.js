import React from 'react';

export default function Login() {

    return (
        <React.Fragment>
            <div className='login'>
                <div className='container'>
                    <a className='logo' href='/'>
                        <img alt='' src='media/logo.png'/>
                    </a>
                    <div className='loginWindow'>
                        <h2><i className="fa-solid fa-user"></i> Login</h2>
                        <div className='line'></div>
                        <p>Hey, Enter your details to get sign in to your account.</p>
                        <span>Username</span>
                        <input autoComplete='off' type='text' onChange={(e) => { e.preventDefault(); }}/>
                        <span>Password</span>
                        <input autoComplete='off' type='password' onChange={(e) => { e.preventDefault(); }}/>
                        <button type='button' onClick={(e) => { e.preventDefault(); }}><i className="fa-solid fa-circle-right"></i> Sign in</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}