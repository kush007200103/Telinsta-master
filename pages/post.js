import React, { useState, useEffect } from 'react'
import ImageUploading from 'react-images-uploading';
import { AiOutlinePlus, AiFillCloseCircle } from 'react-icons/ai';
import { MdChangeCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Post = ({ user }) => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    // eslint-disable-next-line
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    let names = [];
    for (let item of images) {
      names.push(item.file.name);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/addpost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ files: images, names, username: user.username, desc })
    });

    const response = await res.json();
    setLoader(false);
    if (response.success) {
      toast.success('You have posted successfully!', {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setImages([]);
      setDesc("");
    }
    else {
      toast.error("Sorry! Can't post. Some error occurred at our side", {
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

  const [images, setImages] = useState([]);
  const maxNumber = 5;

  const onChange = (imageList, addUpdateIndex) => {
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const [desc, setDesc] = useState("")
  const handleChange = (e) => {
    setDesc(e.target.value);
  }


  return (
    <div className='sm:mt-24 mt-44 w-[80%] m-auto min-h-screen'>
      <Head>
        <title>Telinsta | Add Post</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main>
        <header className='text-center mb-8'>
          <h2 className='text-2xl font-semibold'>Add New Post</h2>
          <p className='text-sm mt-2'>You can select images to post it. You can select upto five images. Images can be uploaded by drap & drop or by selection.</p>
        </header>

        <div className='react-images-uploading mt-12'>
          <label className="block  tracking-wide ml-4 text-red-400 text-sm font-bold mb-2" htmlFor="upload__image-wrapper">
            <span className='uppercase text-gray-700'>Select Images</span>*
          </label>
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
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper" name='upload__image-wrapper'>
                <div className='flex flex-col m-2 items-center'>
                  <button className='w-24 h-24 border-4 border-gray-400 rounded-md flex justify-center items-center'
                    style={isDragging ? { color: 'red' } : undefined}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <AiOutlinePlus className='text-[3rem] text-gray-600' />
                  </button>
                  {images.length !== 0 && <button onClick={onImageRemoveAll} className='text-red-700 hover:bg-red-700 hover:text-white px-2 text-sm py-1 rounded-md mt-1'>Clear All</button>}
                </div>
                <div className='flex flex-wrap justify-center'>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item m-2">
                      <Image src={image['data_url']} alt="selected image" className='w-24 h-24 border-[0.5px] border-gray-100 rounded-md' loader={({ src, width, quality }) => {
                        return `${src}?w=${width}&q=${quality || 75}`
                      }
                      } width={100} height={100}/>
                      <div className="image-item__btn-wrapper">
                        <button onClick={() => onImageUpdate(index)} className='relative -top-24 -right-16 bg-white rounded-full'><MdChangeCircle /></button>
                        <button onClick={() => onImageRemove(index)} className='relative -top-24 -right-16 bg-white rounded-full'><AiFillCloseCircle /></button>
                      </div>
                    </div>
                  ))}
                </div>
                {images.length > 0 && <div className='flex justify-center mb-7 -mt-5'>
                  {images.length < 5 && <span className='text-green-700 text-xs'>
                    You can select {maxNumber - images.length} more image{images.length < 4 ? 's' : ''}
                  </span>
                  }
                  {images.length === 5 && <span className='text-red-700 text-xs'> You can not select more than 5 images</span>}
                </div>}
              </div>
            )}
          </ImageUploading>


        </div>
        <div className="w-full px-3">
          <label className="block  tracking-wide ml-1 text-gray-400 text-sm font-bold mb-2" htmlFor="grid-last-name">
            <span className='uppercase text-gray-700'>Description</span>(Optional)
          </label>
          <textarea className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none" rows={5} name='desc' id='desc' value={desc} onChange={handleChange}></textarea>
        </div>
        <div className='flex justify-center my-2 px-3'>
          {images.length !== 0 && <button onClick={handleSubmit} className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'>Post</button>}
        </div>
      </main>


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

export default Post