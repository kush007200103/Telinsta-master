import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Slider = ({ images }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [imgLink, setImgLink] = useState("");
  useEffect(() => {
    setImgLink(images[slideIndex]);
  }, [images])


  // Next/previous controls
  function plusSlides(n) {
    showSlides(slideIndex + n);
  }

  // Thumbnail image controls
  function currentSlide(n) {
    showSlides(n);
  }

  function showSlides(n) {
    let len = images.length;
    let slide = (n + len) % len;
    setSlideIndex(slide);
    setImgLink(images[slide]);
  }

  return (
    <div className='flex flex-col w-full h-[55vh]'>
      {/* Slideshow container */}
      <div className="slideshow-container relative mr-5 my-2 flex items-center w-full h-[52vh]">
        <div className='flex justify-center items-center w-full py-3 px-4'>
          <span className='text-sm absolute right-5 top-2 font-semibold'>{slideIndex + 1}/{images.length}</span>
          <div className='relative h-[50vh] w-full'>
            {/* <img src={imgLink} alt="" className='max-h-[50vh] px-2 py-2' /> */}
            <Image src={imgLink.length > 0 ? imgLink : "/user.png"} alt={(slideIndex + 1) + "/" + images.length} loader={({ src, width, quality }) => { return `${src}?w=${width}&q=${quality || 75}` }} layout="fill" objectFit="contain" priority={true}/>
          </div>
        </div>

        {/* <!-- Next and previous buttons --> */}
        {images.length > 1 && <div className="buttonControl absolute w-full" >
          <button className="prev cursor-pointer font-bold md:text-[1.5rem] float-left text-black bg-white pb-2 pt-3 px-3 md:px-[0.95rem] shadow-md md:shadow-gray-400 shadow-gray-200 md:pb-7 md:pt-8 rounded-r-md" onClick={() => { plusSlides(-1) }}>&#10094;</button>
          <button className="next cursor-pointer font-bold md:text-[1.5rem] float-right text-black bg-white pb-2 pt-3 px-3 md:px-[0.95rem] shadow-md md:shadow-gray-400 shadow-gray-200 md:pb-7 md:pt-8 rounded-l-md" onClick={() => { plusSlides(1) }}>&#10095;</button>
        </div>}
      </div>

      {/* <!-- The dots/circles --> */}
      <div className='flex items-center justify-center space-x-2'>
        {images.map((img, idx) => {
          return <span key={img} className={`dot cursor-pointer hover:bg-gray-300 rounded-full border-[1px] border-white ${img === imgLink ? "w-3 h-3" : "w-2 h-2"} bg-gray-600`} onClick={() => { currentSlide(idx) }}></span>
        })}
      </div>
    </div>
  );
};

export default Slider; 
