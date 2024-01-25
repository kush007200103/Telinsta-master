import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { BsBookmark, BsHeart, BsHeartFill, BsFacebook, BsCheckLg, BsFillBookmarkStarFill, BsArrow90DegRight } from 'react-icons/bs'
import { MdOutlineContentCopy } from 'react-icons/md'
import { FaTelegramPlane } from 'react-icons/fa'
import { FcSearch } from 'react-icons/fc'
import { FiSend } from 'react-icons/fi'
import { FacebookProvider, Comments } from 'react-facebook';
import mongoose from 'mongoose'
import Post from '../models/Post'
import Slider from '../components/Slider';
import { useRouter } from 'next/router';

const Home = ({ posts, user, likePost, savePost, logout, getBriefDetails }) => {
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
    getSuggestions();
    getOwnerDetails();
  }, [user])

  const [like, setLike] = useState("");
  const [save, setSave] = useState("");

  const [key, setKey] = useState(0);
  const getOwnerDetails = async () => {
    for (let post of posts) {
      let obj = await getBriefDetails(post.username);
      post.profilepic = obj.profilepic;
      post.name = obj.name;
    }
    setKey(Math.random());
  }

  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const postedAt = (time) => {
    time = new Date(time);
    let now = Date.now();
    let diff = new Date(now - time)
    return time.toDateString() + " (" + Math.floor(diff / (1000 * 60 * 60 * 24)) + " days ago)";
  }

  const getSuggestions = async () => {
    setLoading(true);
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user.username, name: user.name })
    })
    const response = await res.json();
    setSuggestions(response.suggestions);
    setLoading(false);
  }

  return (
    <div className="max-w-[1800px] m-auto sm:mt-16 mt-36">
      <Head>
        <title>Telinsta</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className='flex md:w-[80%] md:m-auto px-6 md:px-0 py-3 '>
        <div className="posts sm:w-2/3 min-h-screen">
          {posts.map((post) => {
            let url = `${process.env.NEXT_PUBLIC_HOST}/posts/${post._id}`;
            // let url = "https://bigmart-shoplify.netlify.app/";
            return <div key={post._id} className="post my-4 border-2">
              <div className="account py-2 px-3 flex justify-between items-center  border-b-2">
                <Link href={`/users/${post.username}`}>
                  <a className="flex text-sm items-center space-x-2">
                    <Image key={key} src={post.profilepic ? post.profilepic : "/user.png"} alt="" className="w-12 rounded-full object-center cursor-pointer" loader={({ src, width, quality }) => {
                      return `${src}?w=${width}&q=${quality || 75}`
                    }} height={40} width={40} />
                    <div>
                      <p className='text-sm'>{post.username}</p>
                      <p className='text-xs text-gray-500'>{post.name}</p>
                    </div>
                  </a>
                </Link>
                <div className="share flex space-x-1">
                  <Script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v14.0&appId=380635880678112&autoLogAppEvents=1" nonce="Ibcr2JKL"></Script>
                  <div className='px-3 py-1.5 hidden sm:flex text-white bg-blue-600 text-xs rounded-md' data-href={url} data-layout="button" data-size="large"><a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${url}&amp;src=sdkpreparse`} className="fb-xfbml-parse-ignore"><BsFacebook className='text-base' /></a></div>

                  <Link href={`https://t.me/share/url?url=${url}`} ><a className='px-3 py-1.5 text-white bg-blue-500 text-xs rounded-md sm:flex hidden' target='_blank'><FaTelegramPlane className='text-base' /></a></Link>
                  <button onClick={() => { copyToClipboard(url) }} className={`px-3 text-white ${copied === true ? 'bg-green-600' : 'bg-red-600'} text-xs rounded-md flex py-1.5`}>{!copied && <MdOutlineContentCopy className='text-base' />} {copied && <BsCheckLg className='text-base' />}</button>
                </div>
              </div>
              <div className='w-full flex justify-center items-center'>
                <Slider images={post.imgLinks} />
              </div>
              <div className="like flex py-2 justify-between px-3 mt-6 items-center">
                <div className='flex text-2xl space-x-2 items-center'>
                  <button onClick={() => { likePost(user, post, setLike) }}>
                    {(like === post._id || post.likes.includes(user.username)) ? <BsHeartFill className="cursor-pointer text-red-600" /> : <BsHeart className="cursor-pointer " />}
                  </button>
                  <button onClick={() => { savePost(user, post, setSave) }}>{(save === post._id || post.savedBy.includes(user.username)) ? <BsFillBookmarkStarFill className="cursor-pointer text-green-600" /> : <BsBookmark className="cursor-pointer " />}
                  </button>
                  <Link href={`/posts/${post._id}`}>
                    <a>
                      <FiSend className='text-2xl hover:text-blue-800' />
                    </a>
                  </Link>
                </div>
                <div className="flex space-x-1">
                  <div className='px-3 py-1.5 flex sm:hidden text-white bg-blue-600 text-xs rounded-md' data-href={url} data-layout="button" data-size="large"><a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${url}&amp;src=sdkpreparse`} className="fb-xfbml-parse-ignore"><BsFacebook className='text-base' /></a></div>
                  <Link href={`https://t.me/share/url?url=${url}`} ><a className='px-3 py-1.5 text-white bg-blue-500 text-xs rounded-md sm:hidden flex' target='_blank'><FaTelegramPlane className='text-base' /></a></Link>
                </div>
              </div>
              <p className="desc px-2 border-2 py-2">{post.desc}</p>
              <p className="postat text-xs px-2 border-b-2 py-2">Posted At : {postedAt(post.createdAt)}</p>
              <div className="comments">
                <FacebookProvider appId="380635880678112">
                  <Comments href={url} width="100%" numPosts="1"
                    orderBy="reverse-time" />
                </FacebookProvider>
              </div>
            </div>
          })}

          {posts.length === 0 && <div className='flex flex-col items-center justify-center my-8 sm:w-2/3 min-h-[70vh]'>
            <FcSearch className='xl:text-[5rem] text-[4rem] border-blue-800 text-blue-600 border-4 py-4 rounded-full' />
            <p className='my-2 text-sm px-8 italic text-gray-600'>No recents posts found for you.</p>
          </div>}
        </div>
        <div className="suggestions px-4 py-3 left-[64%] top-24 fixed hidden sm:block w-1/3">
          <div className="flex max-w-[360px] border-b-2 pb-3 items-center text-sm justify-between mb-3">
            <Link href={'/account'}>
              <a className='flex items-center space-x-2'>
                <Image src={user.profilepic ? user.profilepic : "/user.png"} className="w-14 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                  return `${src}?w=${width}&q=${quality || 75}`
                }} height={45} width={45} />
                <div>
                  <p className='text-sm'>{user.username}</p>
                  <p className='text-xs text-gray-600'>{user.name}</p>
                </div>
              </a>
            </Link>
            {user.username.length !== 0 && <button className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500' onClick={logout}>logout</button>}
          </div>

          <h2 className='font-semibold mt-5 mb-2'>Suggestions for you...</h2>
          {suggestions.map((item) => {
            return <div className="flex max-w-[360px] items-center text-sm justify-between my-3.5" key={item.username}>
              <Link href={`/users/${item.username}`}>
                <a className='flex items-center space-x-2'>
                  <Image src={item.profilepic} className="w-10 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                    return `${src}?w=${width}&q=${quality || 75}`
                  }} height={40} width={40} />
                  <div>
                    <p className='text-sm'>{item.name}</p>
                    <p className='text-xs text-gray-500'>{item.username}</p>
                  </div>
                </a>
              </Link>
              <Link href={`/users/${item.username}`}><a className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500'><BsArrow90DegRight /></a></Link>
            </div>
          })}
          {suggestions.length === 0 && <div className='flex flex-col items-center justify-center my-8'>
            {loading ? <Image src="/loader.gif" alt="" width={300} height={200} className='w-[300px]' />
              :
              <div className='flex flex-col items-center justify-center'>
                <FcSearch className='xl:text-[5rem] text-[4rem] border-blue-800 text-blue-600 border-4 py-4 rounded-full' />
                <p className='my-2 text-sm px-8 italic text-gray-600'>We failed to found user which matches your profile and not followed by you.</p>
              </div>}

          </div>}

        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }

  const posts = await Post.find();
  posts.reverse();

  return {
    props: { posts: JSON.parse(JSON.stringify(posts)) }
  }
}

export default Home;