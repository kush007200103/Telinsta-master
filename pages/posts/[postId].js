import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import { BsBookmark, BsHeart, BsHeartFill, BsFacebook, BsCheckLg, BsFillBookmarkStarFill } from 'react-icons/bs'
import { MdOutlineContentCopy } from 'react-icons/md'
import { FaTelegramPlane } from 'react-icons/fa'
import { FacebookProvider, Comments } from 'react-facebook';
import mongoose from 'mongoose'
import Post from '../../models/Post'
import { useRouter } from 'next/router';
import Slider from '../../components/Slider';

const Getpost = ({ post, user, likePost, savePost, getBriefDetails }) => {
    const [like, setLike] = useState("");
    const [save, setSave] = useState("");
    let router = useRouter();

    const [postOwner, setPostOwner] = useState({ username: "", name: "", profilepic: "", bio: "" });
    useEffect(() => {
        if(!localStorage.getItem('token')){
            router.push('/login');
        }
        getOwnerDetails();
    }, [post])

    const getOwnerDetails = async () => {
        let obj = await getBriefDetails(post.username);
        setPostOwner(obj);
    }


    useEffect(() => {
        router.push(`${process.env.NEXT_PUBLIC_HOST}/posts/${post._id}`)
    }, [like, save])

    let url = `${process.env.NEXT_PUBLIC_HOST}/posts/${post._id}`;
    const [likers, setLikers] = useState(false);

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

    const showLikers = () => {
        if (likers) {
            setLikers(false);
        }
        else {
            setLikers(true);
        }
    }

    return (
        <div className="max-w-[1800px] m-auto my-36 sm:my-14">
            <Head>
                <title>Telinsta | A post By {post.username}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <main className='md:w-[70%] md:m-auto px-6 md:px-0 py-3'>
                <div className="post my-4 border-2">
                    <div className="account py-2 px-3 flex justify-between items-center  border-b-2">
                        <Link href={`/users/${post.username}`}>
                            <a className="flex text-sm items-center space-x-2">
                                <Image src={postOwner.profilepic.length>0?postOwner.profilepic:"/user.png"} alt="" className="w-12 rounded-full object-center cursor-pointer"  loader={({ src, width, quality }) => {
                                    return `${src}?w=${width}&q=${quality || 75}`
                                }} height={40} width={40} />
                                <div>
                                    <p className='text-sm'>{post.username}</p>
                                    <p className='text-xs text-gray-500'>{postOwner.name}</p>
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
                    <div className="like flex py-2 justify-between items-center px-3 mt-12">
                        <div className='flex text-2xl items-center'>
                            <button onClick={() => { likePost(user, post, setLike) }}>{(like === post._id || post.likes.includes(user.username)) ? <BsHeartFill className="cursor-pointer mr-2 text-red-600" /> : <BsHeart className="cursor-pointer mr-2" />}
                            </button>
                            <button onClick={() => { savePost(user, post, setSave) }}>{(save === post._id || post.savedBy.includes(user.username)) ? <BsFillBookmarkStarFill className="cursor-pointer text-green-600" /> : <BsBookmark className="cursor-pointer " />}</button>
                            <button className='mx-5 text-red-600 py-1 px-2 hover:text-white border-red-600 border-2 hover:bg-red-500 rounded-md text-xs block' onClick={showLikers}>Liked By ({post.likes.length})</button>
                            {likers && <ul className='text-sm flex items-center space-x-2'>
                                {post.likes.map((like, idx) => {
                                    return <li key={like}>
                                        <Link href={`/users/${like}`}><a className='hover:underline hover:text-blue-800'>{like}</a></Link>
                                        {idx !== post.likes.length - 1 ? ", " : ""}</li>
                                })}
                            </ul>}
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
            </main>

        </div>
    )
}

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }

    const post = await Post.findById(context.query.postId);
    return {
        props: { post: JSON.parse(JSON.stringify(post)) }
    }
}

export default Getpost