import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './style/style.css';
import './style/formStyle.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import MainPage from './pages/mainPage';

const ChatApp = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState('');

  const [loggin, setLoggin] = useState(true);
  const [signUp, setSignUp] = useState(true);

  // const [loggin, setLoggin] = useState(false);
  // const [signUp, setSignUp] = useState(false);

  function handleLogin(e){
    e.preventDefault();

    const data = {
      username: username,
      password: password
    };

    fetch('http://localhost:3500/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.status === 200) {
        setLoggin(false); 
        setSignUp(false); 
        return response.json();
      } else {
        return response.json().then(data => {
          setMessage(data.message);
        });
      }
    })    
    .catch(error => {
      console.error(error);
    });

  }

  const handleRegister = (e) => {
    e.preventDefault();
  
    const data = {
      username: username,
      password: password
    };
  
   
    fetch('http://localhost:3500/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    .then(response => {
      if (response.status === 201) {
        setLoggin(false);
        setSignUp(false);

        return response.json();
      } else {
        return response.json().then(data => {
          setLoggin(false);
          setSignUp(true);
          setMessage(data.message);
        });
      }
    })          
    .catch(error => {
      console.error(error);
      setMessage(data.message);
      setLoggin(false);
      setSignUp(true);
    });
  }

  function handleGoBack() {
    setLoggin(true);
    setUsername(''); 
    setPassword(''); 
    setMessage(''); 
  }

  return (
    <>
      {loggin && (
          <div className='loginContainer d-flex align-items-center justify-content-center'>
            <div className='image'>
              <FontAwesomeIcon icon={faUser} className='userIcon' />
            </div>
          <form onSubmit={handleLogin} className='d-grid align-items-center justify-content-center'>
               <div className='mb-3 input-group'>
                 <span className='input-group-text'><FontAwesomeIcon icon={faUser} className='text-light'/></span>
                 <input 
                   type='text'
                   className='form-control'
                   placeholder='Username' 
                   value={username}
                   onChange={e => setUsername(e.target.value)}
                  />
               </div>
               <div className='mb-3 input-group'>
                 <span className='input-group-text'><FontAwesomeIcon icon={faLock} className='text-light'/></span>
                 <input 
                   type='password' 
                   className='form-control ' 
                   placeholder='Password' 
                   value={password} 
                   onChange={e => setPassword(e.target.value)}
                 />
               </div>
                 <div className='d-flex flex-column text-center mt-3'>
                  <div className='d-flex align-items-center justify-content-between '>
                    <button className='btn btn-primary' type='submit'>Login</button>
                    <button onClick={() => {setLoggin(false); setPassword(''); setUsername(''); setMessage('')}}className='btn btn-primary'>Sign Up</button>
                  </div>
                  <div className='display_message'>{'' || <p>{message}</p>}</div>
               </div>
            </form>
          </div>
      )}


      {!loggin && signUp &&(
        <>
        <nav className='d-flex align-item-center justify-content-center'>
          <button className='bg-primary p-4' onClick={handleGoBack}> <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></button>
        </nav>
          <div className='container'>
            <form className="formContainer " onSubmit={handleRegister}>
              <div className="input-container p-5">
                  <div className="input-content">
                      <div className="input-dist">
                          <div className="input-type">
                              <input 
                                required="" 
                                placeholder='Username'
                                type="text" 
                                className="input-is" 
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                              />  
                              <input 
                                placeholder="Password" 
                                required="" 
                                type="password" 
                                className="input-is mb-2" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)}
                              />  
                              <button type='submit' className='btn btn-primary mb-3'>Sign up</button>
                              {'' || <p className='text-white'>{message}</p>}
                          </div>
                      </div>
                  </div>
              </div>
            </form>
          </div>
        </>
        
        
      )}
      {!loggin && !signUp && (
        <MainPage currentUser={username} />
      )}


    </>
   
  );
};

export default ChatApp;
