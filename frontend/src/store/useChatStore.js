import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import {useAuthStore} from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({

    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true, // string 'true' is not equal to boolean true, so parse it before comparing.

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data.message || "Something went wrong");
        }finally{
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        const {authUser} = useAuthStore.getState();

        // updating UI quickly without waiting for the message to save first in the db and then appear on UI
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
          _id: tempId,
          senderId: authUser._id,
          receiverId: selectedUser._id,
          text: messageData.text,
          image: messageData.image,
          createdAt: new Date().toISOString(),
          isOptimistic: true, // flag to identify temporary messages (optional)
        };
        set({ messages: [...messages, tempMessage] });

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData,
          );
          set({ messages: messages.concat(res.data) });
        } catch (error) {
          // if temporary message failed to save in the db, we can remove
          set({ messages: messages });
          
          toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

}));