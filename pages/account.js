import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import ImageUploading from 'react-images-uploading';
import { AiOutlinePlus, AiFillCloseCircle } from 'react-icons/ai';
import { MdChangeCircle } from 'react-icons/md';
import { FaEdit, FaRegWindowClose } from 'react-icons/fa'
import { BsHeartFill } from 'react-icons/bs'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import { toast } from 'react-toastify';
import {useRouter} from 'next/router';

const Account = ({ logout, getBriefDetails }) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({ name: "", email: "", phone: "", bio: "", username: "", followers: [], following: [], profilepic: "" });

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser();
    }
    else{
      router.push('/login');
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    getPosts();
  }, [user])

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [loader, setLoader] = useState(false);
  const [profilePic, setProfilePic] = useState(false);
  const [images, setImages] = useState([]);
  const maxNumber = 1;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const updateProfilepic = async (e) => {
    if (user.username.length > 0) {
      e.preventDefault();
      let name = images[0].file.name;
      setLoader(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/updatepp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: images[0], name, username: user.username })
      });

      const response = await res.json();
      setLoader(false);
      if (response.success) {
        getUser();
        toast.success('Your profile picture has been updated!', {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setImages([]);
        setProfilePic(false);
      }
      else {
        toast.error("Sorry! Can't update. Some error occurred at our side", {
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
  }

  const getUser = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    })
    const response = await res.json();
    if (response.success) {
      setName(response.name);
      setBio(response.bio);
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
    setPosts(response.posts);
    setLoading(false);
  }

  const [followingModal, setFollowingModal] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);
  const [editDetails, setEditDetails] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const handleChange = (e) => {
    if (e.target.name == 'name') {
      setName(e.target.value)
    }
    else if (e.target.name == 'bio') {
      setBio(e.target.value)
    }
  }

  const updateUser = async (e) => {
    e.preventDefault();
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/updateuser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user.username, name, bio })
    })
    const response = await res.json();
    if (response.success) {
      setUser(response.user);
      setName(response.user.name);
      setBio(response.user.bio);
      toast.success('Your profile updated successfully!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEditDetails(false);
    }
    else {
      toast.error("Sorry failed to update profile, please try again!", {
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

  const removeFollower = async (follower) => {
    let found = user.followers.includes(follower);
    if (found) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/follow/remove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user.username, follower })
      })

      const response = await res.json();
      if (response.success) {
        getUser();
        toast.success(`You removed ${follower} from your followers`, {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
      toast.warn(`${follower} hasn't follow you`, {
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

  const stopFollowing = async (following) => {
    let found = user.following.includes(following);
    if (found) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/follow/stop`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user.username, following })
      })

      const response = await res.json();
      if (response.success) {
        getUser();
        toast.success(`You stopped following ${following}`, {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
      toast.warn(`You haven't follow ${following}`, {
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
        <title>Telinsta | My Account</title>
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
            <h2 className="username flex items-center mb-2"><span className=' text-2xl font-semibold'>{user.username}</span><button className='mx-2 text-black py-1 px-3 hover:text-white hover:bg-gray-700 border-2 border-black rounded-md text-sm sm:block hidden' onClick={() => { setEditDetails(true) }}>Edit Profile</button><FaEdit className='mx-2 sm:hidden' onClick={() => { setEditDetails(true) }}/> </h2>
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
                  {user.username.length !== 0 && <button className='mx-2 text-blue-600 py-1 px-2 hover:text-white hover:bg-blue-500 rounded-md text-xs block' onClick={logout}>logout</button>}
                </div>
                <p className="bio text-sm text-gray-600">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="posts mt-5 my-2" id='posts'>
          <h2 className='text-2xl font-extrabold text-center my-3'>Your Posts</h2>
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
            {loading?<Image src="/loader.gif" alt="" width={300} height={200} className='w-[300px]' />
            :
            <div className='flex flex-col items-center justify-center'>
            <BsHeartFill className='xl:text-[5rem] text-[4rem] border-red-600 text-red-600 border-4 py-4 rounded-full' />
            <h3 className='text-black text-xl font-semibold mt-1 mb-2'>You have not posted anything yet.</h3>
            <Link href='/post'><a className='text-gray-700 hover:underline hover:text-blue-700 text-sm'>Click here to make your first post</a></Link>
            </div>}
          </div>}

          <div className="text-center my-3 mt-5">
            <Link href={'/'}><a className='rounded-md text-xs text-gray-600 py-1.5 px-2 hover:text-white hover:bg-gray-700 border-2 border-black'>Explore Other Posts</a></Link>
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
                    <div className="flex w-full items-center text-sm justify-between my-3.5">
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
                      <button className='text-xs rounded-md text-blue-500 py-1 px-3 hover:text-white hover:bg-blue-500' onClick={() => { stopFollowing(follow.username) }}>unfollow</button>
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
                {followers.map((follow) => {
                  return <li key={follow.username}>
                    <div className="flex w-full items-center text-sm justify-between my-3.5" >
                      <Link href={`/users/${follow.username}`}>
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
                      <button className='text-xs rounded-md text-blue-500 py-1 px-3 hover:text-white hover:bg-blue-500' onClick={() => { removeFollower(follow.username) }}>remove</button>
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

      <div className={`modal ${!editDetails ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit sm:min-w-[500px] max-w-[800px] h-[60vh]"  >
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current ">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800 text-center w-full">
                Edit Profile
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                onClick={() => { setEditDetails(false) }}><FaRegWindowClose /></button>
            </div>
            <div className="modal-body my-2 relative p-4 overflow-auto max-h-[50vh]">
              <form>
                <div className="relative z-0 w-full mb-6 group">
                  <input type="text" name="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required value={name} onChange={handleChange} />
                  <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                  <input type="text" name="bio" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required onChange={handleChange} value={bio} />
                  <label htmlFor="bio" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Bio</label>
                </div>
                <div className='w-full flex justify-end'>
                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={updateUser}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${!profilePic ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit sm:min-w-[500px] max-w-[800px] h-[60vh]"  >
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current ">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800 text-center w-full">
                Update Profile Pic
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                onClick={() => { setProfilePic(false) }}><FaRegWindowClose /></button>
            </div>
            <div className="modal-body my-2 relative p-4 overflow-auto max-h-[50vh]">
              <div className='react-images-uploading'>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper" name='upload__image-wrapper'>
                      {images.length == 0 && <div className='flex flex-col m-2 items-center'>
                        <button className='w-24 h-24 border-4 border-gray-400 rounded-md flex justify-center items-center'
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          <AiOutlinePlus className='text-[3rem] text-gray-600' />
                        </button>
                      </div>}
                      <div className='flex flex-wrap justify-center'>
                        {imageList.map((image, index) => (
                          <div key={index} className="image-item m-2">
                            <Image src={image['data_url']} alt="selected image" className='w-24 h-24 border-[0.5px] border-gray-100 rounded-md' loader={({ src, width, quality }) => {
                              return `${src}?w=${width}&q=${quality || 75}`
                            }
                            } width={100} height={100} />
                            <div className="image-item__btn-wrapper">
                              <button onClick={() => onImageUpdate(index)} className='relative -top-24 -right-16 bg-white rounded-full'><MdChangeCircle /></button>
                              <button onClick={() => onImageRemove(index)} className='relative -top-24 -right-16 bg-white rounded-full'><AiFillCloseCircle /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>

              <div className='flex justify-center my-2 px-3'>
                {images.length !== 0 && <button onClick={updateProfilepic} className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Update</button>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${!loader ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit"  >
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current ">
            <div className="modal-body relative overflow-auto max-h-[40vh] flex justify-center items-center">
            <Image src="/loader.gif" alt="" width={300} height={200} className='w-[300px]' />
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}


export default Account