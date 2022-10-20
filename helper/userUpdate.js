const User = require('../database/schema/User')
async function update(user, Name, Phone) {
    //updating user name and phone nuumber
    if (user) {
        if (!Name && !Phone) {
            return false
        }
        else if (!Phone) {
            await User.findByIdAndUpdate(user._id, { name: Name })
            return true;
        }
        else if (!Name) {
            await User.findByIdAndUpdate(user._id, { phone: Phone })
            return true;
        }
        else {
            await User.findByIdAndUpdate(user._id, { name: Name, phone: Phone })
            return true
        }
    }
    else {
        console.log('User not found')
    }
}
module.exports = update;
