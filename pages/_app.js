import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../styles/globals.css'
import '../styles/app.css'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0)
  const [key, setKey] = useState(0);


  useEffect(() => {
    router.events.on('routeChangeStart', () => { setProgress(40) })
    router.events.on('routeChangeComplete', () => { setProgress(100) })
    const token = localStorage.getItem('token');
    setKey(Math.random());
    if (token) {
      getUser();
    }
  }, [router.query])

  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", bio: "", username: "" });
  const getUser = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    })
    const response = await res.json();
    setUserInfo(response);
  }

  const likePost = async (user, post, setLike) => {
    if (user.username.length > 0 && post.username.length > 0) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/likepost`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reqBy: user.username, id: post._id })
      })

      const response = await res.json();
      if (response.success) {
        if (response.found) {
          setLike("");
        } else {
          setLike(post._id);
        }
      }
    }
    else {
      toast.warn('Please try again after some time!', {
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

  const savePost = async (user, post, setSave) => {
    if (user.username.length > 0 && post.username.length > 0) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/savepost`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reqBy: user.username, id: post._id })
      })

      const response = await res.json();
      if (response.success) {
        if (response.found) {
          setSave("");
        } else {
          setSave(post._id);
        }
      }
    }
    else {
      toast.warn('Please try again after some time!', {
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

  const getBriefDetails = async (username) => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/getuserbrief`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    const response = await res.json();
    if (response.success) {
      return response;
    }
    else {
      return { name: "", bio: "", username: "", profilepic: "" }
    }
  }

  const logout = ()=>{
    localStorage.clear();
    router.push('/login');
  }

  return <>
    <Navbar key={key} user={userInfo} />
    <LoadingBar
      color='#f11946'
      waitingTime={500}
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
    <ToastContainer />
    <Component {...pageProps} user={userInfo} setUser={setUserInfo} likePost={likePost} savePost={savePost} logout={logout} getBriefDetails={getBriefDetails}/>
    {router.pathname !== '/chat' && <Footer />}
  </>
}

export default MyApp
