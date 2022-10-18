const User = require('../database/schema/User')
async function update( user,Name,Phone ){
        if (user) {
            //updating user name and phone nuumber
            await User.findByIdAndUpdate(user._id, { name: Name, phone: Phone })
            return true
        }
        else{
            return false
        }
}

module.exports = update;
