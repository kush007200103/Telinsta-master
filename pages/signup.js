import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import Image from 'next/image'
import { FaRegWindowClose } from 'react-icons/fa';
import firebase from './api/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";

const Signup = () => {

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
    // eslint-disable-next-line
  }, [])

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", username: "", phone: "" })

  const [enterOTP, setEnterOTP] = useState(false);
  const [phoneOTP, setPhoneOTP] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    if (e.target.name === "phoneotp") {
      setPhoneOTP(e.target.value);
    }
    else {
      if (e.target.name == 'username') {
        if (e.target.value.includes(' ')) {
          toast.warn('No space & capital letters allowed in username!', {
            position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        e.target.value = e.target.value.toLowerCase();
        e.target.value = e.target.value.replace(/\s/g, '');
      }
      setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formBody = credentials;
    formBody.username = formBody.username.toLowerCase();
    formBody.name = formBody.name.trim();
    formBody.username = formBody.username.replace(/\s/g, '');
    setCredentials(formBody);

    if (phoneVerified) {
      let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formBody)
      })

      const response = await res.json();
      if (response.success) {
        localStorage.setItem('token', response.token);
        toast.success('Your account has been created!', {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          router.push('/');
        }, 1000);
        setCredentials({ name: "", email: "", password: "", username: "", phone: "" });
      }
      else {
        toast.error(response.error, {
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
      toast.warn('Please verify your phone number first!', {
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


  const verfiyRecaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log('captcha resolved');
        verifyPhoneNumber();
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      },
      defaultCountry: "IN"
    }, auth);
  }

  const [phoneVerified, setPhoneVerified] = useState(false);
  const verifyPhoneNumber = () => {
    const auth = getAuth();
    const phoneNumber = credentials.phone;
    verfiyRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier).then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setEnterOTP(true);
      toast.success(`OTP sent to ${phoneNumber}`, {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch((error) => {
      console.log("OTP not sent", error);
      // toast.error(`OTP not sent. Please try after some time`, {
      //   position: "top-left",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
    });
  }

  const verifyOTP = (e) => {
    e.preventDefault();
    const code = phoneOTP;
    confirmationResult.confirm(code).then((result) => {
      const user = result.user;
      setPhoneVerified(true);
      toast.success('Phone number is verified successfully!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setEnterOTP(false);
    }).catch((error) => {
      setPhoneVerified(false);
      console.log(error);
      toast.error('You have entered wrong OTP!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  }



  return (
    <div className=''>
      <ToastContainer />
      <Head>
        <title>Telinsta | SignUp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-full flex flex-col lg:flex-row items-center justify-center py-12 px-4 sm:px-6 lg:px-8 md:mt-11 mt-20 space-x-2 space-y-2 h-full">
        <Image src="/login.jpg" alt="" width={600} height={520} />
        <div className="max-w-md w-full space-y-8 p-8 border-2">
          <div>
            <h2 className=" text-center text-3xl font-extrabold text-gray-900">Sign Up to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or
              <Link href={'/login'} ><a className="font-semibold text-blue-700 hover:text-blue-500"> Login </a></Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div id="recaptcha-container"></div>
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input onChange={handleChange} id="name" name="name" type="text" value={credentials.name} autoComplete="name" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-t-md focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Name" />
              </div>
              <div>
                <label htmlFor="name" className="sr-only">Username</label>
                <input onChange={handleChange} id="username" name="username" type="text" value={credentials.username} autoComplete="username" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username" />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input onChange={handleChange} id="email" name="email" type="email" value={credentials.email} autoComplete="email" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Email address" />
              </div>
              <div className='flex'>
                <label htmlFor="email-address" className="sr-only">Phone</label>
                <input onChange={handleChange} id="phone" name="phone" type="tel" value={credentials.phone} autoComplete="phone" required className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Phone Number with country code" />
                {credentials.phone.length > 11 && <span onClick={verifyPhoneNumber} className='text-green-500 appearance-none relative block w-1/4 px-2 py-3 border border-gray-300 rounded-r-md text-sm bg-slate-100 font-semibold cursor-pointer'>Get OTP</span>}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input onChange={handleChange} id="password" name="password" type="password" value={credentials.password} autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Remember me </label>
              </div>

              <div className="font-semibold text-sm text-blue-700 hover:text-blue-500">
                <Link href={'/forgot'}>
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent  font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>







      <div className={`modal ${!enterOTP ? 'hidden' : 'flex'} z-30 fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden justify-center items-center overflow-y-auto bg-[rgba(0,0,0,0.4)] `}>
        <div className="modal-dialog relative pointer-events-none w-fit sm:min-w-[500px] max-w-[800px] h-[60vh]"  >
          <div className="modal-content border-none shadow-lg relative flex flex-col  pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current ">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800 text-center w-full">
                Phone Number Verification
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                onClick={() => { setEnterOTP(false) }}><FaRegWindowClose /></button>
            </div>
            <div className="modal-body my-2 relative p-4 overflow-auto max-h-[50vh]">
              <form onSubmit={verifyOTP} className='flex'>
                <input type="text" name="phoneotp" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-100 appearance-none  dark:border-gray-400 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Enter OTP" required value={phoneOTP} onChange={handleChange} />
                <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Verify</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup