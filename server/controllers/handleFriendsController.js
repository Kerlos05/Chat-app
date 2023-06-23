const User = require('../model/User'); 

const addNewFriend = async(req, res) => {
    const friend = req.body.friends;
    const username = req.body.currentUser;

    // Check if the requested name is in the DB
    const foundFriend = await User.findOne({ username: friend });

    if(!foundFriend){
      return res.status(404).json({'Message' : `${ friend} not found`});

    } else{
      const foundUser = await User.findOne({ username: username}); 

      //Here we are adding the friend together 
      foundFriend.friendsTo.push(username); 
      foundUser.friendsTo.push(friend);

      try {
        await Promise.all([foundUser.save(), foundFriend.save()]);
      } catch (err) {
        console.error(err);
      }
      return res.status(201).json({'Message' : `${ friend} added`});
    }
}

const deleteFriend = async(req, res) => {
  const friend = req.body.friends;
  const username = req.body.currentUser;
  try{
    const foundUser = await User.findOneAndUpdate(
      { username: username },
      { $pull: { friendsTo: friend } },
      { new: true }
    )
  
    const foundFriend = await User.findOneAndUpdate(
      { username: friend },
      { $pull: { friendsTo: username } },
      { new: true }
    );
  
    await User.updateMany(
      { username: username },
      { $pull: { message: { $elemMatch: { $eq: friend } } } }
    ).exec();
  
    await User.updateMany(
      { username: friend },
      { $pull: { message: { $elemMatch: { $eq: username } } } }
    ).exec();  
  } catch(err){
    console.log(err);
  }
  res.status(200).end();
}


const getAllFriends = async (req, res) => {
  const { username } = req.params;
  const foundUser = await User.findOne({ username });
  const friends = foundUser.friendsTo

  res.json({ friends })
};


module.exports = {addNewFriend, getAllFriends, deleteFriend};