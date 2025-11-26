import mongoose from "mongoose";

// create a schema
const userSchema = new mongoose.Schema({
    // every single user should have email with the type of string etc..
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // every single user should have fullname...
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: "",
    },
}, { timestamps: true }); //created At & updated At

//create a "User" model based off this "userSchema"
//we can interact with the users in the user collection/table in db through this "User" Object
const User = mongoose.model("User", userSchema);

export default User;