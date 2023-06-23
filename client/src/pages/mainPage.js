import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/mainPage.css";
import io from 'socket.io-client'
import { handleAddFriend, sendNewMessage, getFriends, deleteMessage} from '../actions/actions';

const socket = io('http://localhost:4500');


const MainPage = ({ currentUser }) => {
    const [addFriend, setAddFriend] = useState('');
    const [sendMessage, setSentMessages] = useState('');
    const [friends, setFriends] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [activeFriend, setActiveFriend] = useState('');

    const activeFriendRef = useRef(activeFriend);

    useEffect(() => {
      activeFriendRef.current = activeFriend;
    }, [activeFriend]);
    
    // Change to selectedFriend
    const handleClickFriend = async(friend) => {
        socket.emit('joinFriend', friend, currentUser);
        const updatedActiveFriend = friend;

        setActiveFriend(friend);

        const data = {
            currentUser: currentUser,
            selectedFriend: updatedActiveFriend
        }


        fetch(`http://localhost:3500/handleMessage`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            const messages = data.map(arr => arr[1]); 
            setReceivedMessages(messages || ''); 
        }) 
    };
      
    socket.emit('join_room', currentUser);

    const handleAddfriend = async(e) => {
        e.preventDefault();
        const duplicateFriend = friends.find((friend) => friend === addFriend);

        if(addFriend === currentUser || addFriend === '' || duplicateFriend) {
            setAddFriend(''); 
            return ; 
        }   

        handleAddFriend(currentUser, addFriend, socket, setFriends); 
        setAddFriend(''); 
    }

    
    const handleSendMessage = (e) => {
        e.preventDefault();
        const findActive =  friends.find(friend => friend === activeFriend); 

        if(friends.length === 0 || !findActive || sendMessage === ''){
            return; 
        }

        sendNewMessage(socket, sendMessage, activeFriend, currentUser, setReceivedMessages); 
        setSentMessages(''); 
    }
       
    useEffect(() => {
        socket.on('namesExchanged', (whoAddedMe, addedFriend) => {
            const duplicateFriend = friends.find((friend) => friend === whoAddedMe);
            if(whoAddedMe === currentUser || duplicateFriend || addedFriend !== currentUser){
                return ;
            } 
            setFriends((prev) => {
                if (prev.includes(whoAddedMe)) {
                  return prev;
                } else {
                  return [...prev ,whoAddedMe];
                }
            });
            
        });
        
        socket.on('receive_message', (msg, reciver, user) => {
            if(reciver !== currentUser || user != activeFriendRef.current){
                return ;
            }
            setReceivedMessages(prev => [...prev, msg]);
        })          

        socket.on('removeFriendFromClient', (reciver, removeFriend) => {
            if(reciver !== currentUser){
                return ; 
            }
            setFriends((prevFriends) => prevFriends.filter((friend) => friend !== removeFriend));
            setReceivedMessages([]); 
        });
    
        return () => {
            socket.off('clear_messages'); 
            socket.off('namesExchanged');
            socket.off('receive_message');
            socket.off('removeFriendFromClient'); 
        };
    }, [socket]);
    
    function handleCopy(item){
        navigator.clipboard.writeText(item); 
    }
    
    const handleDelete = (messageContent) => {
        deleteMessage(currentUser, activeFriend, messageContent, setReceivedMessages); 
    }

    
    const handleRemoveFriend = async(removeFriend) => {
        setReceivedMessages([]); 
        setActiveFriend('');
        await new Promise(r => setTimeout(r, 200)); 

        socket.emit('removeFriend', removeFriend, currentUser); 
        // Updating the current users UI
        setFriends((prevFriends) => prevFriends.filter((friend) => friend !== removeFriend));
        const data= {
            currentUser: currentUser,
            friends: removeFriend
        }

        await fetch('http://localhost:3500/handleFriend', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        .then((res) => {
            if(res.ok){
                setReceivedMessages([]); 
                setActiveFriend(''); 
            }   else{
                return; 
            }
        })
        return ; 
    }

    useEffect(() => {
        getFriends(currentUser, setFriends);
    }, [currentUser])  

    
    const handleLogout = async() => {
        const data={
            username: currentUser
        }
        fetch('http://localhost:3500/logout',{
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.ok){
                window.location.reload()
            }
        })
    } 
    
    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            handleLogout();
        });
    
    }, []);

    return(
        <>
            <div className='containerForAllContent'>
                <header className='d-flex justify-content-between align-items-center bg-primary p-2'>
                    <h1>MERN chat</h1>
                </header>
    
                <div className='container-fluid d-flex allContent '>
                    <aside className='w-25 p-2 me-2 '>
                        <form className='w-100' onSubmit={handleAddfriend}>
                            <input 
                                className='form-control' 
                                placeholder='Search for friends' 
                                value={addFriend}
                                onChange={e => setAddFriend(e.target.value)}
                            />
                            <hr />
                        </form>

                        <div className='d-flex flex-column gap-3' style={{ position: 'relative', bottom: '30px' }}>
                            {friends.map((name, index) => {
                                return  (
                                    <div key={index} 
                                    onClick={(e) => {
                                        handleClickFriend(name);
                                    }}
                                    className={`d-flex align-items-center justify-content-between friendDisplayer p-2 ${name === activeFriend ? 'notActive' : ''}`}>
                                        {name}
                                        <button 
                                            className='btn btn-primary'   
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFriend(name);
                                            }}>
                                                Remove
                                            </button>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='d-flex justify-content-between align-items-center logoutSection'>
                            <h6 className=''>
                                <FontAwesomeIcon icon={faUser} className='me-3'/>
                                {currentUser || 'aa'}
                            </h6>
                            <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
                        </div>
                    </aside>
                    <main className='w-75 p-2 d-flex flex-column ' >
                        <section className='text-bg-dark p-3'>
                        {activeFriend !== '' && receivedMessages.map((item, index) => {
                            return (
                                    <div key={index} className='d-flex align-items-center justify-content-between mb-3 bg-info text-break p-3'>
                                        {item}
                                        <div className='d-flex gap-3 ms-3' >
                                            <button className='btn bg-white' onClick={() => handleDelete(item)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button className='btn bg-white' onClick={() => handleCopy(item)}>
                                            <FontAwesomeIcon icon={faCopy} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                        <footer >
                            <form className='d-flex w-100' onSubmit={handleSendMessage}>
                                <input 
                                    placeholder='Type your message' 
                                    className='form-control' 
                                    value={sendMessage} 
                                    onChange={e => setSentMessages(e.target.value)}
                                />
                                <button type='submit' className='btn btn-primary'>Send</button>
                            </form>
                        </footer>
                    </main> 
                </div>
            </div>
        </>
    
    )
}

export default MainPage; 
    
