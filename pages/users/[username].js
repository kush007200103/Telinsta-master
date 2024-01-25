import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaRegWindowClose } from 'react-icons/fa'
import { BsHeartFill, BsArrow90DegRight } from 'react-icons/bs'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'

const Profile = ({ getBriefDetails }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState({ name: "", bio: "", username: "", followers: [], following: [], profilepic: "" });
  const [posts, setPosts] = useState([]);

  const [loggedUser, setloggedUser] = useState({ name: "", bio: "", username: "", followers: [], following: [], profilepic: "" });

  const [followingModal, setFollowingModal] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [follower, setFollower] = useState(false);
  useEffect(() => {
    getUser();
    if (localStorage.getItem('token')) {
      getLoggedUser();
    }
  }, [router])

  useEffect(() => {
    getPosts();
  }, [user])

  useEffect(() => {
    checkFollowing();
  }, [user, loggedUser])


  const checkFollowing = () => {
    // Checking whether this user is followed by loggedUser or not
    let found = user.followers.includes(loggedUser.username);
    if (found) {
      setFollower(true);
    }
  }

  const getLoggedUser = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    })
    const response = await res.json();
    setloggedUser(response);
  }

  const getUser = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/getthisuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    const response = await res.json();
    if (response.success) {
      setUser(response);
      let temp = [];
      for (let follow of response.followers) {
        let det = await getBriefDetails(follow);
        temp.push(det);
      }

      setFollowers(temp);
      temp = [];
      for (let follow of response.following) {
        let det = await getBriefDetails(follow);
        temp.push(det);
      }
      setFollowing(temp);
    }
    else {
      setUser({ name: "", bio: "", username: "User Not Found", followers: [], following: [], profilepic: "" });
    }
  }

  const getPosts = async () => {
    setLoading(true);
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/getuserpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user.username })
    })
    const response = await res.json();
    if (response.success) {
      setPosts(response.posts);
    }
    setLoading(false);
  }

  const followUser = async () => {
    if (loggedUser) {
      let found = user.followers.find(({ username }) => username === loggedUser.username);
      if (!found) {
        let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/follow/start`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reqBy: loggedUser.username, reqTo: username })
        })

        const response = await res.json();
        if (response.success) {
          getUser();
          toast.success(`You started following ${username}`, {
            position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFollower(true);
        }
        else {
          toast.error('Sorry! Some error occurred', {
            position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
      else {
        toast.warn('You have already followed this user', {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
    else {
      toast.warn('Please login first to continue!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const startChat = async () => {
    if (loggedUser) {
      let users = [username, loggedUser.username];
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
        router.push('/chat');
      }
    }
    else {
      toast.warn('Please login first to continue!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <div className="max-w-[1800px] m-auto my-36 sm:my-12">
      <Head>
        <title>Telinsta | {user.username}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className='md:w-[75%] md:m-auto px-6 md:px-0 py-3 '>
        <div className="userdetails flex min-h-[40vh] items-center space-y-2 mb-3 border-b-2 pb-2">
          <div className="sm:flex hidden w-[40%] justify-end items-center mr-16">
            <Image src={user.profilepic.length > 0 ? user.profilepic : "/user.png"} alt="profile picture" onClick={() => { setProfilePic(true) }} className='h-44 rounded-full cursor-pointer shadow-md' loader={({ src, width, quality }) => {
              return `${src}?w=${width}&q=${quality || 75}`
            }} height={140} width={140} />
          </div>
          <div className="sm:w-[60%] w-full flex sm:block flex-col items-center">
            <h2 className="username flex items-center mb-2">
              <span className=' text-2xl font-semibold'>{user.username}</span>
              {user.name.length > 0 && loggedUser.username !== user.username && !follower && loggedUser.username.length > 0 && <button className='mx-2 text-blue-600 py-1 px-3 hover:text-white hover:bg-blue-500 border-2 border-blue-600 rounded-md text-sm block' onClick={followUser}>Follow</button>}
              {user.name.length > 0 && loggedUser.username !== user.username && follower && loggedUser.username.length > 0 && <button className='mx-2 text-blue-600 py-1 px-3 hover:text-white hover:bg-blue-500 border-2 border-blue-600 rounded-md text-sm block'>Following</button>}
            </h2>
            <div className="flex flex-col">
              <div className="flex">
                <div className='sm:hidden mr-2'>
                  <Image src={user.profilepic.length > 0 ? user.profilepic : "/user.png"} className="w-24 cursor-pointer rounded-full object-center mr-6  shadow-md" alt="" loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`
                  }} height={70} width={70} />
                </div>
                <div className="flex flex-col sm:flex-row justify-start ml-0.5 sm:space-x-11 mb-5">
                  <a href='#posts'> <span className="posts font-semibold">{posts.length}</span> posts</a>
                  <p className='cursor-pointer' onClick={() => { setFollowerModal(true) }}> <span className="followers font-semibold">{user.followers.length}</span> followers</p>
                  <p className='cursor-pointer' onClick={() => { setFollowingModal(true) }}> <span className="following font-semibold">{user.following.length}</span> following</p>
                </div>
              </div>
              <div>
                <div className="name flex space-x-2">
                  <span>{user.name}</span>
                  {user.name.length > 0 && loggedUser.username !== user.username && loggedUser.username.length > 0 && <button className='mx-2 text-blue-600 py-1 px-2 hover:text-white hover:bg-blue-500 rounded-md text-xs block' onClick={startChat}>Message</button>}
                </div>
                <p className="bio text-sm text-gray-600">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="posts mt-5 my-2" id='posts'>
          <h2 className='text-2xl font-extrabold text-center my-3'>User Posts</h2>
          {posts.length > 0 && <div className="flex flex-wrap justify-center">
            {posts.map((post) => {
              return <Link href={`/posts/${post._id}`} key={post._id}>
                <a className="border-[1px] m-2" >
                  <Image alt="gallery" className="w-28 h-28 object-cover object-center " src={post.imgLinks[0]} loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`
                  }} height={90} width={90} />
                </a>
              </Link>
            })}
          </div>}
          {posts.length === 0 && <div className='flex flex-col items-center justify-center h-full my-8'>
            {loading ? <Image src="/loader.gif" alt="" width={300} height={200} className='w-[300px]' />
              :
              <div className='flex flex-col items-center justify-center'>
                <BsHeartFill className='xl:text-[5rem] text-[4rem] border-red-600 text-red-600 border-4 py-4 rounded-full' />
                <h3 className='text-black text-xl font-semibold mt-1 mb-2'>User has not posted anything yet.</h3>
              </div>}
          </div>}

          <div className="text-center my-3 mt-5">
            <Link href={'/'}><a className='rounded-md text-sm text-gray-600 py-2 px-3 hover:text-white hover:bg-gray-700 border-2 border-black'>Explore Other Posts</a></Link>
          </div>
        </div>
      </main>




      <div className={`modal ${!followingModal ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit sm:min-w-[500px] max-w-[800px] h-[60vh]">
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current " >
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800 text-center w-full">
                Following
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                onClick={() => { setFollowingModal(false) }}><FaRegWindowClose /></button>
            </div>
            <div className="modal-body relative p-4 overflow-auto max-h-[50vh]">
              <ul>
                {following.map((follow) => {
                  return <li key={follow.username}>
                    <div className="flex w-full items-center text-sm justify-between my-3.5" >
                      <Link href={`/users/${follow.username}`}>
                        <a className='flex items-center space-x-2' onClick={() => { setFollowingModal(false) }}>
                          <Image src={follow.profilepic} className="w-10 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                            return `${src}?w=${width}&q=${quality || 75}`
                          }} height={35} width={35} />
                          <div className='cursor-pointer'>
                            <p className='text-sm'>{follow.username}</p>
                            <p className='text-xs text-gray-500'>{follow.name}</p>
                          </div>
                        </a>
                      </Link>
                      <Link href={`/users/${follow.username}`}><a className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500'><BsArrow90DegRight /></a></Link>
                    </div>
                  </li>
                })}
              </ul>
              {following.length === 0 && <div className='flex flex-col items-center justify-center h-full my-8'>
                <HiOutlineEmojiSad className='xl:text-[5rem] text-[4rem] border-gray-600 text-gray-600 border-4 py-4 rounded-full' />
                <p className='text-black my-2'>You have not follow any user yet</p>
              </div>}
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${!followerModal ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit sm:min-w-[500px] max-w-[800px] h-[60vh]"  >
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current ">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800 text-center w-full">
                Followers
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                onClick={() => { setFollowerModal(false) }}><FaRegWindowClose /></button>
            </div>
            <div className="modal-body relative p-4 overflow-auto max-h-[50vh]">
              <ul>
                {followers.length > 0 && followers.map((follow) => {
                  return <li key={follow.username}>
                    <div className="flex w-full items-center text-sm justify-between my-3.5">
                      <Link href={`/users/${follow.username}`} >
                        <a className='flex items-center space-x-2' onClick={() => { setFollowerModal(false) }}>
                          <Image src={follow.profilepic} className="w-10 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                            return `${src}?w=${width}&q=${quality || 75}`
                          }} height={35} width={35} />
                          <div className='cursor-pointer'>
                            <p className='text-sm'>{follow.username}</p>
                            <p className='text-xs text-gray-500'>{follow.name}</p>
                          </div>
                        </a>
                      </Link>
                      <Link href={`/users/${follow.username}`}><a className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500'><BsArrow90DegRight /></a></Link>
                    </div>
                  </li>
                })}

              </ul>

              {followers.length === 0 && <div className='flex flex-col items-center justify-center h-full my-8'>
                <HiOutlineEmojiSad className='xl:text-[5rem] text-[4rem] border-gray-600 text-gray-600 border-4 py-4 rounded-full' />
                <p className='text-black my-2'>You have not any follower</p>
              </div>}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile