import { throttle } from 'lodash'; // Importing a throttling utility like Lodash throttle


export const handleAddFriend = (currentUser, addFriend, socket, setFriends, ) => {
    const data = {
        currentUser: currentUser,
        friends: addFriend, 
    };

    fetch('http://localhost:3500/handleFriend', {   
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (res.status === 201) {
            socket.emit('addFriend', addFriend, currentUser);
            setFriends((prev) => [...prev, addFriend]);
        } else if (res.status === 404) {
            console.log(res.message);
        }
    })
    .catch(err => {
        console.error(err.message);
    });
};

export const getFriends = (currentUser, setFriends) => {
    fetch(`http://localhost:3500/handleFriend/getFriends/${encodeURIComponent(currentUser)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(res => res.json())
    .then(data => {
        const { friends } = data;
        setFriends(friends);
    })
    .catch(error => {
        console.error(error);
        // Handle any errors here
    });
};

// ***************************************      HANDLE ROOM     ***************************************


// ***************************************      HANDLE MESSAGE     ***************************************

export const sendNewMessage = throttle(
    (socket, sendMessage, activeFriend, currentUser, setReceivedMessages) => {
      const data = {
        content: sendMessage,
        currentUser: currentUser,
        selectedFriend: activeFriend,
      };
  
      fetch('http://localhost:3500/handleMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            socket.emit('sendMessage', sendMessage, activeFriend, currentUser);
            setReceivedMessages((prev) => [...prev, sendMessage]);
          }
        });
    },
    400, 
  );
  



export const deleteMessage = throttle(
    async (currentUser, activeFriend, messageContent, setReceivedMessages) => {
      const data = {
        currentUser: currentUser,
        friend: activeFriend,
        messageToRemove: messageContent,
      };
  
      await fetch('http://localhost:3500/handleMessage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          if (res.ok) {
            setReceivedMessages((prevMessages) => {
              const messageIndex = prevMessages.findIndex(
                (message) => message === messageContent
              );
              if (messageIndex !== -1) {
                const updatedMessages = [...prevMessages];
                updatedMessages.splice(messageIndex, 1);
                return updatedMessages;
              }
              return prevMessages;
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    700 
  );






// export const deleteMessage = async(currentUser, activeFriend, messageContent, setReceivedMessages) => {
//     await new Promise(r => setTimeout(r, 400)); 
    
//     const data= {
//         currentUser: currentUser, 
//         friend: activeFriend, 
//         messageToRemove: messageContent, 
//     }

//     fetch('http://localhost:3500/handleMessage', {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     })
//     .then(res => {
//         if(res.ok){
//             setReceivedMessages((prevMessages) => {
//                 const messageIndex = prevMessages.findIndex(
//                 (message) => message === messageContent
//                 );
//                     if (messageIndex !== -1) {
//                     const updatedMessages = [...prevMessages];
//                     updatedMessages.splice(messageIndex, 1);
//                     return updatedMessages;
//                 }
//                 return prevMessages;
//             });
//         }
//     })
// }