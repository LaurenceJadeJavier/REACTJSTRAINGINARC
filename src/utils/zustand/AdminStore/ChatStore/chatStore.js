import { createWithEqualityFn } from "zustand/traditional";
import { authStore } from "../../AuthStore/authStore";
import { GET } from "../../../../services/api";
import socket from "../../../socket/socket";

//getting user info
const getAccount = () => {
  return authStore.getState().userInformation;
};

//function for fetching chat list
const fetchAllChat = async (set) => {
  const { isEmployee } = getAccount();
  if (isEmployee?._id) {
    const { data } = await GET(`/chat-rooms/employees/${isEmployee?._id}`);
    socket.emit(
      "join-room",
      data?.map(({ _id }) => _id),
    );
    return set({
      chat: data,
      chatUserId: isEmployee?._id,
    });
  }
};

//function for fetching messages
const fetchRoomInfo = async (set, room_id, employee, isLoading) => {
  const { data } = await GET(`/chat-rooms/${room_id}`);
  set({
    chatRoomId: room_id,
    chatRoom: data,
    receiverInfo: employee,
  });
  return isLoading(); //turn off loading after fetching
};

//socket -> joining room ids -> ex. [room_id1,room_id2,room_id3, etc.]
const joinRoom = (roomId) => {
  socket.emit("join-room", roomId);
};

//socket -> sending message base on room id params {emp_id, message, room}
const sendMessage = (chatDetails) => {
  socket.emit("send-chat", chatDetails);
};

//socket -> receive message from other employee, based on room id
const receiveMessage = (set, chatRoom, chatRoomId) => {
  let copyChatRoom = [...chatRoom];
  socket.on("message", async (response) => {
    //checking if same room id to insert the message
    if (chatRoomId === response.chat_room_id) {
      copyChatRoom.push(response);
      return await set({ chatRoom: copyChatRoom });
    } else {
      return await set({ chatRoom: copyChatRoom });
    }
  });
};

const chat = {
  chat: [],
  receiverInfo: {},
  chatUserId: "",
  chatRoomId: "",
  chatRoom: [],
};

const createChatStore = (set, get) => ({
  ...chat,
  fetchAllChat: () => fetchAllChat(set),
  fetchRoomInfo: (room_id, employee, isLoading) =>
    fetchRoomInfo(set, room_id, employee, isLoading),
  joinRoom: (roomId) => joinRoom(roomId),
  sendMessage: (chatDetails) => sendMessage(chatDetails),
  receiveMessage: (chatRoom, chatRoomId) =>
    receiveMessage(set, chatRoom, chatRoomId),
  clearChatRoom: () =>
    set({
      chatRoom: [],
    }),
});

export const chatStore = createWithEqualityFn(createChatStore);
