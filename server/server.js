require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const corsOptions = require('./config/corsOptions'); 
const User = require('./model/User');


const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


connectDB(); 

app.use(express.json());

app.use(credentials)

app.use(cors(corsOptions));

app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

app.use('/handleFriend', require('./routes/handleFriend')); 
app.use('/handleMessage', require('./routes/handleMessage')); 

app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/auth'));


app.listen(PORT);


const io = require('socket.io')(4500, {
    cors: {
      origin: ['http://localhost:3000']
    },
});


io.on('connection', (socket) => {
  socket.on('join_room', room => {
    socket.join(room); 
  })

  socket.on('addFriend', async (addFriend, currentUser) => {
    socket.join(addFriend);
    io.to(addFriend).emit('namesExchanged', currentUser, addFriend);
    socket.leave(addFriend);
  });

  socket.on('joinFriend', (friend) => {
    socket.join(friend); 
  })

  socket.on('sendMessage', (message, recipient, user) => {
    io.to(recipient).emit('receive_message', message, recipient, user);
  });


  socket.on('removeFriend', (removeFriend, currentUser) => {
    io.to(removeFriend).emit('removeFriendFromClient', removeFriend ,currentUser);
  });

});
