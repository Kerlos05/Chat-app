
const User = require('../model/User');


const addNewMessage = async(req, res) => {
    const content = req.body.content;
    const currentUser = req.body.currentUser;
    const selectedFriend = req.body.selectedFriend;

    const foundUser = await User.findOne({ username: currentUser}); 
    const arr1 = [selectedFriend, content]; 
    foundUser.message.push(arr1); 

    const foundFriend = await User.findOne({ username: selectedFriend}); 
    const arr2 = [currentUser, content]; 
    foundFriend.message.push(arr2); 

    try{
        const res1 = await foundUser.save();
        const res2 = await foundFriend.save();
    }   catch(err){
        console.log(err.message);
    }
    res.sendStatus(200);
}

const deleteMessage = async(req, res) => {
    const currentUser = req.body.currentUser;
    const content = req.body.messageToRemove;
    const selectedFriend = req.body.friend;
    
    try {
      const foundUser = await User.findOne({ username: currentUser });
    
      const index = foundUser.message.findIndex(
        (arr) => arr[0] === selectedFriend && arr[1] === content
      );
    
      if (index !== -1) {
        foundUser.message.splice(index, 1);
      }
    
      const result1 = await foundUser.save();
      console.log(result1);
    
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }

}

const getAllMessages = async (req, res) => {
    try {
      const { selectedFriend, currentUser } = req.body;
  
      const user = await User.findOne({ username: currentUser });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      let messages = [];
      
      if (user.message.length > 0) {
        messages = user.message.filter((arr) => arr[0] === selectedFriend);
      }
      
      return res.json( messages );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  


module.exports = {addNewMessage, deleteMessage, getAllMessages}; 