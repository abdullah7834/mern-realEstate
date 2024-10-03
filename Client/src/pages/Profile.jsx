import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getStorage , ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage'
import {app} from '../firebase.js'




function Profile() {
  const {currentUser} = useSelector((state)=> state.user)
  const fileRef = useRef(null)
  const [file , setFIle] = useState(undefined)
  const [fileperc , setFileperc] = useState(0)
  const [fileuploadError , setFileuploadError] = useState(false)
  const[formData , setFormData] = useState({})

//fire base Storage ::
// allow read;
// allow  write :if 
// request.resource.size <2 * 1024 * 1024 &&
// request.resource.contentType.matches('image/.*')
useEffect(()=>{
  if(file){
    handleFileUpload(file);
  }
}, [file])
const handleFileUpload =(file)=>{
  const storage = getStorage(app)
  const fileName =new Date().getTime() + file.name;
  const storageRef = ref(storage , fileName)
  const uploadTask = uploadBytesResumable(storageRef , file)

  uploadTask.on('state_changed' , (snapshot)=>{
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFileperc(Math.round(progress))
  },
  (error)=>{
    setFileuploadError(true)
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setFormData({...formData , avatar : downloadURL})
    })
  }
)
} 
  return (
    <div className='p-3  max-w-lg mx-auto  '>
      <h1 className='text-3xl font-bold text-center py-7'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <input onChange={(e)=> setFIle(e.target.files[0])}
         type="file" ref={fileRef} hidden accept='image/*'  />
        <img  onClick={()=>fileRef.current.click()}
         src={formData.avatar || currentUser.avatar} alt="profile"  className='self-center rounded-full h-24 w-24 object-cover cursor-pointer mt-2'/>
         <p className='text-sm self-center'>
         {
          fileuploadError ? (
            <span className='text-red-700'>File upload error(image must be less than 2mb)</span>
          ) : fileperc > 0  && fileperc < 100 ? (
            <span className='text-slate-700'>{`uploading  ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className='text-green-700 '>Image Successfully Uploaded</span>
          ) : (
              ''
          )
         } 
         
         </p>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' />
        <button className='bg-slate-700 text-white p-3 uppercase rounded-lg  hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default Profile