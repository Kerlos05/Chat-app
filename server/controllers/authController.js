const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isLoggedIn = {}; // Object to store logged-in status

const handleLogin = async (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const foundUser = await User.findOne({ username: user }).exec();

  if (!foundUser) {
    return res.status(401).json({ message: 'Username or password is invalid' });
  }

  if (isLoggedIn[user]) {
    return res.status(401).json({ message: 'User is already logged in' });
  }

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    isLoggedIn[user] = true;
    res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Username or password is invalid' });
  }
};

const handleLogout = (req, res) => {
    const user = req.body.username;

    if (!user) {
      return res.status(400).json({ message: 'Username is required' });
    }
  
    if (!isLoggedIn[user]) {
      return res.status(401).json({ message: 'User is not logged in' });
    }
  
    isLoggedIn[user] = false;
    res.status(200).json({ message: 'Logout successful' });
}; 

module.exports = { handleLogin, handleLogout };
