import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { AiOutlineHome, AiTwotoneHome } from 'react-icons/ai';
import { IoIosSearch } from 'react-icons/io';
import { RiAccountCircleLine, RiAccountCircleFill } from 'react-icons/ri';
import { BsChatLeftText, BsChatLeftTextFill, BsPlusSquare, BsPlusSquareFill, BsHeart, BsHeartFill, BsSave2, BsSave2Fill, BsArrow90DegRight } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';


const Navbar = () => {
    const [token, setToken] = useState(false);
    let router = useRouter();

    useEffect(() => {
        highlight();
    }, [router.pathname])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setToken(true)
        }
    }, []);

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const findMatchingResults = async (e) => {
        let val = e.target.value;
        setSearch(val);
        if (val.length > 2) {
            let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user/searchuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search: val })
            })
            const response = await res.json();
            if (response.success) {
                setResults(response.users)
            }
            console.log(response);
        }
        else {
            setResults([]);
        }
    }


    const [icons, setIcons] = useState({ home: false, savedposts: false, activity: false, chat: false, post: false, account: false })

    const highlight = () => {
        let path = router.pathname;
        if (path === '/') {
            setIcons({ home: true, savedposts: false, activity: false, chat: false, post: false, account: false })
        }
        else if (path === '/chat') {
            setIcons({ home: false, savedposts: false, activity: false, chat: true, post: false, account: false })
        }
        else if (path === '/post') {
            setIcons({ home: false, savedposts: false, activity: false, chat: false, post: true, account: false })
        }
        else if (path === '/activity') {
            setIcons({ home: false, savedposts: false, activity: true, chat: false, post: false, account: false })
        }
        else if (path === '/savedposts') {
            setIcons({ home: false, savedposts: true, activity: false, chat: false, post: false, account: false })
        }
        else if (path === '/account') {
            setIcons({ home: false, savedposts: false, activity: false, chat: false, post: false, account: true })
        }
    }

    return (
        <div className=" m-auto border-b-2 fixed top-0 w-full z-20 bg-white">
            <main className='md:w-[90%] lg:w-[80%] max-w-[1400px] md:m-auto px-6 md:px-0 flex space-y-2 sm:space-y-0 flex-col sm:flex-row justify-between items-center py-3 '>
                <div className="logo">
                    <Link href={'/'} ><a className=' text-[1.85rem] font-semibold appname'>Telinsta</a></Link>
                </div>
                {token && <div className="searchBar sm:block hidden">
                    <div>
                        <button disabled className='relative top-0.5 left-6 text-gray-500 '><IoIosSearch /></button>
                        <input type="text" name="search" id="search" className='border-2 bg-gray-100 py-2 rounded-md px-5 text-sm outline-none min-w-[21vw] pl-7' placeholder='Search' value={search} onChange={findMatchingResults} />
                        {results.length > 0 && <div className="absolute bg-gray-50 shadow-md overflow-auto max-h-[50vh] min-w-[23vw] pt-0.5">
                            <ul>
                                {results.map((user) => {
                                    return <div key={user.username}>
                                        <div className="flex w-full items-center text-sm justify-between hover:bg-gray-200 p-4 rounded-md">
                                            <Link href={`/users/${user.username}`}>
                                                <a className='flex items-center space-x-2' >
                                                    <Image src={user.profilepic} className="w-10 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                                                        return `${src}?w=${width}&q=${quality || 75}`
                                                    }} height={35} width={35} />
                                                    <div className='cursor-pointer'>
                                                        <p className='text-sm'>{user.username}</p>
                                                        <p className='text-xs'>{user.name}</p>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href={`/users/${user.username}`}><a className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500'><BsArrow90DegRight /></a></Link>
                                        </div>
                                        <hr />
                                    </div>
                                })}

                            </ul>
                        </div>}
                    </div>
                </div>}
                {token && <nav className="nav">
                    <ul className='flex space-x-3 md:space-x-7 items-center justify-evenly'>
                        {!icons.home && <Link href='/'><a><AiOutlineHome className='text-3xl' /></a></Link>}
                        {icons.home && <Link href='/'><a><AiTwotoneHome className='text-3xl' /></a></Link>}
                        {!icons.chat && <Link href='/chat'><a><BsChatLeftText className='text-2xl' /></a></Link>}
                        {icons.chat && <Link href='/chat'><a><BsChatLeftTextFill className='text-2xl' /></a></Link>}
                        {!icons.post && <Link href='/post'><a><BsPlusSquare className='text-2xl' /></a></Link>}
                        {icons.post && <Link href='/post'><li><BsPlusSquareFill className='text-2xl' /></li></Link>}
                        {!icons.savedposts && <Link href='/savedposts'><a><BsSave2 className='text-2xl' /></a></Link>}
                        {icons.savedposts && <Link href='/savedposts'><a><BsSave2Fill className='text-2xl font-light' /></a></Link>}
                        {!icons.activity && <Link href='/activity'><a><BsHeart className='text-2xl' /></a></Link>}
                        {icons.activity && <Link href='/activity'><a><BsHeartFill className='text-2xl' /></a></Link>}
                        {!icons.account && <Link href='/account'><a><RiAccountCircleLine className='text-3xl' /></a></Link>}
                        {icons.account && <Link href='/account'><a><RiAccountCircleFill className='text-3xl' /></a></Link>}
                    </ul>
                </nav>}
                {token && <div className="searchBar sm:hidden block">
                    <div className=''>
                        <div className="flex">
                            <button disabled className='relative top-0.5 left-6 text-gray-500 '><IoIosSearch /></button>
                            <input type="text" name="search" id="search" className='border-2 bg-gray-100 py-2 rounded-md px-5 outline-none min-w-[21vw] pl-7 text-sm' placeholder='Search' value={search} onChange={findMatchingResults} />
                        </div>
                        {results.length > 0 && <div className="absolute bg-gray-50 shadow-md overflow-auto max-h-[50vh] w-[65vw] pt-0.5">
                            <ul>
                                {results.map((user) => {
                                    return <div key={user.username}>
                                        <div className="flex w-full items-center text-sm justify-between hover:bg-gray-200 p-4 rounded-md">
                                            <Link href={`/users/${user.username}`}>
                                                <a className='flex items-center space-x-2' >
                                                    <Image src={user.profilepic} className="w-10 cursor-pointer rounded-full object-center" alt="" loader={({ src, width, quality }) => {
                                                        return `${src}?w=${width}&q=${quality || 75}`
                                                    }} height={35} width={35} />
                                                    <div className='cursor-pointer'>
                                                        <p className='text-sm'>{user.username}</p>
                                                        <p className='text-xs'>{user.name}</p>
                                                    </div>
                                                </a>
                                            </Link>
                                            <Link href={`/users/${user.username}`}><a className='text-xs rounded-md text-blue-500 py-1.5 px-3 hover:text-white hover:bg-blue-500'><BsArrow90DegRight /></a></Link>
                                        </div>
                                        {/* <hr /> */}
                                    </div>
                                })}

                            </ul>
                        </div>}
                    </div>
                </div>}
                {!token && <ul className='flex space-x-3 items-center justify-evenly'>
                    <Link href={'/login'}>
                        <a className='mx-2 text-black py-1 px-3 hover:text-white hover:bg-gray-700 border-2 border-black rounded-md text-sm '>Login</a>
                    </Link>
                    <Link href={'/signup'}>
                        <a className='mx-2 text-black py-1 px-3 hover:text-white hover:bg-gray-700 border-2 border-black rounded-md text-sm '>SignUp</a>
                    </Link>
                </ul>}
            </main>
        </div>
    )
}

export default Navbar