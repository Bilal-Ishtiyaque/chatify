import cloudinary from "../lib/cloudinary.js";

import User from "../models/User.js";
import Message from "../models/Message.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password"); // excluding you or the current logged in user

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error In 'getAllContacts' controller: ", error.message);
        res.status(500).json({message: "Internal Server Error" });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const {id} = req.params;

        // me and you: two possible cases:
        // either i send you the message
        // either you send me the message

        const messages = await Message.find({
            $or: [ // With $or, both conditions are checked for every message in the database
                {senderId: myId, receiverId: id}, // if i sended you the message, sender is me & receiver is you
                {senderId: id, receiverId: myId}, // if you sended me the message, sender is you & receiver is me
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in 'getMessagesByUserId' controller: ", error.message);
        res.status(500).json({message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const senderId = req.user._id;
        const {id: receiverId} = req.params;

        if(!text && !image){
            return res.status(400).json({ message: "Text or image is required." });
        }

        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if(image){
            // uploading base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo: send message in real-time if the user is online

        res.status(200).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage Controller: ", error.message);
        res.status(500).json({message: "Internal Server Error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });

        const chatPartnerIds = [...new Set(messages.map((msg) => {
            return msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString() // if i am the sender, give me the receiver id, and if i am the reciever, give me the senderId, Because the goal is to get a list of chat partners, not the logged-in user themselves. If you returned your own ID instead, you’d just get yourself repeated many times, which is not useful.
        }))]; 

        const chatPartners = await User.find({_id: { $in: chatPartnerIds }}).select("-password");

        res.status(200).json(chatPartners);

    } catch (error) {
        console.error("Error in 'getChatPartners' controller: ", error.message);
        res.status(500).json({message: "Internal Server Error" });
    }
};