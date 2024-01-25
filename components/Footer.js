import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
      <main className='m-auto max-w-[1800px] z-20'>
        <footer className="bg-gray-100 text-center lg:text-left">
          <div className="text-center text-black p-4">
            © 2022 Copyright :
            <Link href="/"><a className="text-gray-800" > telinsta.com</a></Link>
          </div>
        </footer>
      </main>
  )
}

export default Footer