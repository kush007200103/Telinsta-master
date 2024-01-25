import React, { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';
import { FcSearch } from 'react-icons/fc';
import io from 'socket.io-client';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import InputEmoji from "react-input-emoji";
import { useRouter } from 'next/router';

const socket = io.connect(process.env.NEXT_PUBLIC_HOST);

const Chat = ({ user, getBriefDetails }) => {
  let router = useRouter();

  const [loading, setLoading] = useState(false);

  // socket = io.connect(process.env.NEXT_PUBLIC_HOST);

  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [key, setKey] = useState(0);
  const [selectedChat, setSelectedChat] = useState({ name: "", username: "", profilepic: "" });
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
    else {
      socketInitializer();
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    getChats();
  }, [user])

  useEffect(() => {
    if (room.length > 0 && messages.length > 0) {
      router.push("#62af4fbc5f6c6e4cbb594530035495bbc4e6c6f5cbf4fa26")
    }
  }, [messages])


  const socketInitializer = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/chat/socket`);
    // socket = io.connect(process.env.NEXT_PUBLIC_HOST);

    // socket.on('connection', () => {
    //   console.log('connected')
    // })
  }

  const getChats = async () => {
    setLoading(true);
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/chat/getchats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user.username })
    });
    const response = await res.json();

    if (!response.error) {

      response.sort(function (a, b) {
        let keyA = new Date(a.updatedAt), keyB = new Date(b.updatedAt);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      for (let chat of response) {
        let otheruser = chat.users[0] === user.username ? chat.users[1] : chat.users[0];
        let obj = await getBriefDetails(otheruser);
        chat.profilepic = obj.profilepic;
        chat.name = obj.name;
        chat.username = obj.username;
      }
      setChats(response);
      setLoading(false);
    }
  }

  const joinRoom = (room, message) => {
    if (room !== "") {
      socket.emit('join_room', room);
      socket.on('receive_message', ({ data, room }) => {
        // console.log("message received",data,room)
        if (data.sender !== user.username) {
          let msg = message;
          msg.push(data);
          setMessages(msg);
          setKey(Math.random());

          // Update Chats Orders
          let newOrder = chats;
          let idx = chats.findIndex((obj) => { return obj._id === room });
          for (let i = idx; i > 0; i--) {
            [newOrder[i], newOrder[i - 1]] = [newOrder[i - 1], newOrder[i]];
          }
          setChats(newOrder);
        }
      })
    }
  }

  const handleSubmit = () => {
    let msg = messages;
    let data = { msg: input, sender: user.username, receiver: selectedChat.username, time: Date.now() };
    msg.push(data);
    setMessages(msg);
    socket.emit("send_message", { data, room });
    setInput("");
    router.push("#62af4fbc5f6c6e4cbb594530035495bbc4e6c6f5cbf4fa26")

    // Update Chats Orders
    let newOrder = chats;
    let idx = chats.findIndex((obj) => { return obj._id === room });
    for (let i = idx; i > 0; i--) {
      [newOrder[i], newOrder[i - 1]] = [newOrder[i - 1], newOrder[i]];
    }
    setChats(newOrder);
  }

  const settingRoom = async (chat) => {
    let otheruser = chat.users[0] === user.username ? chat.users[1] : chat.users[0];
    let selchat = chats.filter(obj => obj.username === otheruser)[0];
    setSelectedChat({ name: selchat.name, username: selchat.username, profilepic: selchat.profilepic });
    let users = [user.username, otheruser];
    users.sort()
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/chat/startchat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ users })
    });
    const response = await res.json();
    if (response.success) {
      setRoom(response.room);
      setMessages(response.messages);
      joinRoom(response.room, response.messages);
    }
  }

  const timestamp = (time) => {
    time = new Date(time);
    time = time.toTimeString().split(':')
    return time[0]+":"+time[1];
  }

  return (
    <div className="max-w-[1800px] m-auto sm:mt-[4.5rem] mt-40">
      <Head>
        <title>Telinsta | Chat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className='flex md:w-[80%] md:m-auto px-6 md:px-0 py-3'>
        <div className={`${selectedChat.username.length === 0 ? 'block' : 'hidden'} md:block suggestions md:w-1/3 w-full border-2 md:h-[85vh]`}>
          <h3 className='font-semibold text-lg border-b-2 h-[9.7vh] flex justify-center items-center'>
            <Link href={'/account'}><a>{user.username}</a></Link>
          </h3>

          <div className='overflow-y-auto h-[75vh]'>
            {chats.map((chat) => {
              return <div key={chat._id} onClick={() => { settingRoom(chat) }} className={`flex ${chat.users.includes(selectedChat.username) ? 'bg-gray-100' : 'hover:bg-gray-50'} cursor-pointer max-w-[360px] py-3 px-5 items-center text-sm `}>
                <div className='flex items-center space-x-2 cursor-pointer'>
                  <Image src={chat.profilepic ? chat.profilepic : "/user.png"} className="w-14 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`
                  }} height={40} width={40} />
                  <div>
                    <p className='font-semibold uppercase'>{chat.name}</p>
                    <p className='font-light text-sm'>{chat.users[0] === user.username ? chat.users[1] : chat.users[0]}</p>
                  </div>
                </div>
              </div>
            })}
            {chats.length === 0 && <div className='flex flex-col items-center justify-center my-8'>
              {loading ? <Image src="/loader.gif" alt="" width={300} height={200} className='w-[300px]' />
                :
                <div className='flex flex-col items-center justify-center'>
                  <FcSearch className='xl:text-[5rem] text-[4rem] border-blue-800 text-blue-600 border-4 py-4 rounded-full' />
                  <p className='my-2 text-sm px-5 italic text-gray-600'>Find an user to start conversation that will appear here.</p>
                </div>}
            </div>}

          </div>

        </div>
        <div className={`posts md:w-2/3 w-full min-h-[70vh] ${selectedChat.username.length > 0 ? '' : 'hidden'} md:block border-2 md:h-[85vh]`}>
          {selectedChat.username.length === 0 && <div className='flex flex-col items-center justify-center h-full'>
            <FiSend className='xl:text-[5rem] text-[4rem] border-blue-800 text-blue-600 border-4 py-4 rounded-full' />
            <h1 className='text-black text-2xl font-semibold mt-1 mb-2'>Your Messages</h1>
            <p className='text-gray-800'>Selected any chat to start conversation</p>
          </div>}
          {selectedChat.username.length > 0 && <div className='h-full'>
            <div className='font-semibold text-lg border-b-2 h-[9.7vh] flex px-3 items-center justify-between'>
              <div className='flex items-center'>
                <BiArrowBack className='mr-5 cursor-pointer' onClick={() => { setSelectedChat({ name: "", username: "", profilepic: "" }) }} />
                <div className='hover:bg-gray-50'><a className='flex uppercase  items-center'>
                  <Image src={selectedChat.profilepic} className="w-8 cursor-pointer rounded-full object-center mr-3" alt="" loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`
                  }} height={35} width={35} /><span className='px-2'>{selectedChat.username}</span> </a></div>
              </div>
              <Link href={`/users/${selectedChat.username}`}><a className=' rounded-md text-blue-500 py-1 px-3 hover:text-white hover:bg-blue-500'><BsFillEyeFill /></a></Link>
            </div>

            <div className='messages overflow-y-auto h-[65vh] bg-gray-50'>
              <ul className='' key={key}>
                {
                  messages.map((msg) => {
                    return <li key={Math.random()} className={`flex items-end ${msg.sender === user.username ? 'justify-end ml-20 sm:ml-36 lg:ml-56' : 'justify-start mr-20 lg:mr-56 sm:mr-36'} m-1`}>
                      <span className={`text-bold text-black ${msg.sender === user.username ? 'float-right bg-blue-600' : 'float-left bg-gray-600'} text-white px-3 py-1 rounded-md`}>{msg.msg}</span>
                      <span className='text-[0.5rem] pl-0.5 pb-0.5 text-gray-600 underline'>{timestamp(msg.time)}</span>
                    </li>
                  })
                }
                <li id={"62af4fbc5f6c6e4cbb594530035495bbc4e6c6f5cbf4fa26"}></li>
              </ul>
            </div>

            <div className='my-2 relative w-[97%] m-auto flex h-fit'>
              <InputEmoji
                value={input}
                onChange={setInput}
                cleanOnEnter
                onEnter={handleSubmit}
                placeholder="Message..."
                fontSize={18}
                height={50}
              />
              <button className=' text-blue-500 rounded-r-md text-3xl mx-1' onClick={handleSubmit}><AiOutlineSend /></button>
            </div>
          </div>}
        </div>
      </main >
    </div >
  )
}

export default Chat;