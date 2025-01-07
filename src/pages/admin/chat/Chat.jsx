import React, { useEffect, useRef, useState } from "react";
import * as Io5icons from "react-icons/io5";
import { CustomInput } from "../../../components/inputs/CustomInput";
import { chatStore } from "../../../utils/zustand/AdminStore/ChatStore/chatStore";
import { shallow } from "zustand/shallow";
import fullNameFormat from "../../../utils/NameFormat/fullNameFormat";
import { authStore } from "../../../utils/zustand/AuthStore/authStore";
import defaultImg from "../../../assets/images/blankProfile.jpg";
import moment from "moment";
import socket from "../../../utils/socket/socket";
import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
import { POST } from "../../../services/api";
export default function Chat() {
  const messageRef = useRef(null);

  //global state
  const {
    fetchAllChat,
    chat,
    fetchRoomInfo,
    chatRoom,
    chatUserId,
    chatRoomId,
    joinRoom,
    sendMessage,
    receiveMessage,
    receiverInfo,
    clearChatRoom,
  } = chatStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { employee } = employeeStore((state) => state, shallow);
  const [search, setSearch] = useState(false); //state -> hide show search bar
  const [filterEmp, setFilterEmp] = useState(""); //state -> search value
  const [mychat, setMyChat] = useState({}); //state -> message value
  const [myRoomId, setMyRoomId] = useState(""); //state -> store chat room ID

  //fetch all chats
  useEffect(() => {
    fetchAllChat();
  }, [chatRoom]);

  //socket -> fetching new messages
  useEffect(() => {
    receiveMessage(chatRoom, myRoomId);
  }, [socket, chatRoom, myRoomId]);

  //once room receive message perform scroll down -> viewing latest chat
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        // behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [chatRoom]);

  //sending chat
  const submitChatFunction = async () => {
    if (mychat?.message) {
      sendMessage(mychat);
      return setMyChat({ emp_id: chatUserId, message: "", room: chatRoomId });
    }
  };

  //validating room if already exist -> based on clicked employee
  const checkIfRoomExist = (data) => {
    if (chat?.length > 0) {
      const checkId = chat.filter(({ employee }) => employee._id === data?._id);
      if (checkId?.length > 0) {
        return getConversation(checkId[0]?.employee, checkId[0]?._id);
      } else return createChatRoom(data?._id, data);
    } else return createChatRoom(data?._id, data);
  };

  //creating new chat room
  const createChatRoom = async (employeeId, employee) => {
    const emp_ids = [employeeId, chatUserId]; // [employee ID, your ID (base on account logged)]
    const { status, data } = await POST("/chat-rooms", { emp_ids });

    if (status === 201) {
      let copyChat = [...chat];
      copyChat.push({ _id: data?._id });
      fetchAllChat();
      return getConversation(employee, data?._id, copyChat, true);
    }
  };

  //loading function -> for fetching data
  function isLoad() {
    return loadingHoc(false);
  }

  const getConversation = (employee, _id, roomIDList, newlyCreated) => {
    loadingHoc(true); //start loading
    clearChatRoom(); //clearing chat room before fetching new room
    joinRoom(
      newlyCreated
        ? roomIDList?.map(({ _id }) => _id)
        : chat?.map(({ _id }) => _id),
    ); //joining room -> contains list of room ids
    setMyRoomId(_id);
    fetchRoomInfo(_id, employee, isLoad); //getting chats -> specific room [room ID, employee details, loading function]
  };

  //search layout after click search button
  const searchLayout = () => {
    return (
      <div className="flex w-full items-center px-3">
        {search ? (
          <div className="my-2 flex w-full items-center justify-between rounded-lg bg-lightBlue px-3">
            <input
              type="text"
              value={filterEmp}
              onChange={(e) => setFilterEmp(e.target.value)}
              className="h-full w-full bg-transparent focus:outline-none"
            />
            <button
              onClick={() => {
                setFilterEmp("");
                setSearch(!search);
              }}
              className="btn  rounded-2xl bg-lightBlue"
            >
              <Io5icons.IoClose className="text-xl text-primaryBlue" />{" "}
            </button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between px-3 py-2">
            <div className="text-xl font-medium">Chats</div>
            <button
              onClick={() => setSearch(!search)}
              className="btn  rounded-2xl bg-lightBlue"
            >
              <Io5icons.IoSearchOutline className="text-xl text-primaryBlue" />{" "}
            </button>
          </div>
        )}
      </div>
    );
  };

  const chatLayout = () => {
    return (
      <div className="flex h-[85vh] w-full flex-col  overflow-hidden overflow-y-scroll p-3">
        {search
          ? employee
              .filter(({ fullName }) =>
                fullName?.toLowerCase()?.includes(filterEmp?.toLowerCase()),
              )
              ?.map((res) => {
                const { departments, _id, emp_img, ...rest } = res ?? {};
                const { name } = departments ?? {};
                return (
                  <div
                    className="flex cursor-pointer justify-between rounded-xl p-5 hover:bg-lightBlue"
                    key={_id}
                    onClick={() => checkIfRoomExist(res)}
                  >
                    <div className="flex flex-row gap-4">
                      <img
                        src={emp_img || defaultImg}
                        className="h-10 w-10 rounded-full ring-1 ring-neutralDark ring-offset-4"
                      />
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">
                          {fullNameFormat({
                            ...rest,
                            isMiddleInitial: true,
                          })}
                        </div>
                        <div className="w-40 max-w-xs overflow-hidden truncate text-ellipsis text-xs text-neutral-400">
                          {name ?? "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          : chat?.map(({ employee, chat, _id }) => {
              const { message } = chat ?? {};
              return (
                <div
                  className="flex cursor-pointer justify-between rounded-xl p-5 hover:bg-lightBlue"
                  key={_id}
                  onClick={() => {
                    getConversation(employee, _id);
                  }}
                >
                  <div className="flex flex-row gap-4">
                    <img
                      src={employee?.emp_img || defaultImg}
                      className="h-10 w-10 rounded-full ring-1 ring-neutralDark ring-offset-4"
                    />
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">
                        {fullNameFormat({
                          ...employee,
                          isMiddleInitial: true,
                        })}
                      </div>
                      <div className="w-40 max-w-xs overflow-hidden truncate text-ellipsis text-xs text-neutral-400">
                        {message ?? "Start conversation now"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    );
  };

  const chatRoomLayout = () => {
    const { department, emp_img } = receiverInfo ?? {};
    return (
      chatRoomId && (
        <div className="flex h-full w-full basis-3/4 flex-col rounded-xl bg-white drop-shadow-lg">
          <div className="flex items-center justify-start px-5 py-3">
            <div className="text-x flex flex-row gap-4">
              <div>
                <img
                  src={emp_img || defaultImg}
                  className="h-10 w-10 rounded-full ring-1 ring-neutralDark ring-offset-4"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-medium">
                  {fullNameFormat({ ...receiverInfo, isMiddleInitial: true })}
                </div>
                <div className="flex flex-row items-center gap-1 text-xs text-gray-400">
                  {department?.name ?? ""}
                </div>
              </div>
            </div>
          </div>
          <div className="divider -my-1 text-primaryBlue"></div>
          <div className="relative flex h-[85vh] flex-col gap-2   p-5">
            <div className={`flex h-[70vh] flex-col justify-end gap-2   `}>
              <div className="h-fit flex-col gap-2 overflow-hidden overflow-y-scroll p-5  ">
                {chatRoom?.length > 0 ? (
                  chatRoom?.map(({ emp_id, message, createdAt }) => {
                    const { _id, emp_img } = emp_id ?? {};
                    return (
                      <div key={_id}>
                        <div className="text-center text-xs text-gray-400">
                          {moment(createdAt).format("LT")}
                        </div>
                        {_id !== chatUserId ? (
                          <div className="chat chat-start" ref={messageRef}>
                            <div className="avatar chat-image">
                              <div className="w-10 rounded-full ring-1 ring-primaryBlue ring-offset-4">
                                <img src={emp_img || defaultImg} />
                              </div>
                            </div>
                            <div className="chat-bubble max-w-lg break-all bg-highlight text-neutralDark">
                              {message}
                            </div>
                          </div>
                        ) : (
                          <div className="chat chat-end" ref={messageRef}>
                            <div className="avatar chat-image">
                              <div className="w-10 rounded-full ring-1 ring-primaryBlue ring-offset-4">
                                <img src={emp_img || defaultImg} />
                              </div>
                            </div>
                            <div className="chat-bubble max-w-lg break-all bg-primaryBlue">
                              {message}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-full w-full animate-pulse justify-center">
                    <div className="w-fit rounded-xl border p-2">
                      Start conversation now
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className=" flex  flex-row gap-3 ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitChatFunction();
                }}
                className="w-full"
              >
                <div className="relative flex w-full items-center">
                  <CustomInput
                    label="Message"
                    value={mychat?.message}
                    onChange={({ target }) => {
                      setMyChat({
                        emp_id: chatUserId,
                        message: target.value,
                        room: chatRoomId,
                      });
                    }}
                  />
                  <Io5icons.IoSend
                    onClick={() => submitChatFunction()}
                    className="absolute right-0  top-0 h-[3.7rem] w-10 cursor-pointer rounded-r-xl  bg-lightBlue p-2 text-2xl  text-primaryBlue"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <div className="flex h-fit w-full flex-row gap-5">
      <div className="flex h-full w-full basis-1/4 flex-col rounded-xl bg-white drop-shadow-lg">
        {searchLayout()}
        <div className="divider -my-1 text-primaryBlue"></div>
        {chatLayout()}
      </div>
      {chatRoomLayout()}
    </div>
  );
}
