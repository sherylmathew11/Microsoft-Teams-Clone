const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//creating the Schema  for login and signup
const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: [true, 'Username cannot be blank!']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank!']
    }
})

//finding the user from the username and 
//comparing stored hashed password and inputted password(after bcrypt hashing) 
userSchema.statics.findAndValidate = async function (username , password){
    const foundUser = await this.findOne({username});
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

module.exports = mongoose.model("User", userSchema);