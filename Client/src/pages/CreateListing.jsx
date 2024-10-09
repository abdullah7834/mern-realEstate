
import React, { useState } from 'react'
import {getDownloadURL, getStorage, uploadBytesResumable , ref} from 'firebase/storage'
import {app} from '../firebase.js'


function CreateListing() {
  const[files , setFiles] = useState([])
const[formData , setFormData] = useState({
  imageUrls : [],
})
const [imageUploadError  , setImageUploadError] = useState(false)
const [uploading  , setUploading] = useState(false)


  const handleImageSubmit =(e) =>{
    if(files.length >0  && files.length + formData.imageUrls.length < 7){
      setUploading(true)
      setImageUploadError(false)
       const promises = [];
       for(let i =0 ; i <files.length ; i++){
        promises.push(storeImage(files[i]))
       }
       Promise.all(promises).then((urls)=>{
        setFormData({...formData , imageUrls : formData.imageUrls.concat(urls)});
        setImageUploadError(false)
        setUploading(false)
       
       }).catch((error)=>{
        setImageUploadError("Image Upload Failed (2 mb max per image)")
        setUploading(false)
       })
      
    }else{
      setImageUploadError("You can only upload 6 Images per Listing")
      setUploading(false)
    }
  };
 const storeImage = async (file) =>{
   return new Promise((resolve , reject) =>{
    const storage = getStorage(app)
    const fileName =new Date().getTime() + file.name ;
    const storageRef = ref(storage , fileName);
    const uploadTask = uploadBytesResumable(storageRef , file)
   uploadTask.on(
    "state_changed", 
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
     
    },
    (error)=>{
      reject(error) 
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        resolve(downloadURL)
      });

    }
   )


   })
 }

 const handleRemoveImage = (index) =>{
  setFormData(...formData , formData.imageUrls.filter((_ , i) => i !== index))
 }
  return (
    <main className='p-3 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold text-center my-7'>Create a listing</h1>
        <form className='flex flex-col lg:flex-row gap-4'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
              type="text"
              placeholder='Name'
              className='border p-3 rounded-lg'
              id='name'
              maxLength='62'
              minLength='10'
              required
            />
            <textarea
              placeholder='Description'
              className='border p-3 rounded-lg'
              id='description'
              required
            />
            <input
              type="text"
              placeholder='Address'
              className='border p-3 rounded-lg'
              id='address'
              required
            />
            <div className="flex flex-wrap gap-6">
              <div className='flex gap-2 items-center'>
                <input type="checkbox" id='sale' className='w-5' />
                <span>Sell</span>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="checkbox" id='rent' className='w-5' />
                <span>Rent</span>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="checkbox" id='parking' className='w-5' />
                <span>Parking spot</span>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="checkbox" id='furnished' className='w-5' />
                <span>Furnished</span>
              </div>
              <div className='flex gap-2 items-center'>
                <input type="checkbox" id='offer' className='w-5' />
                <span>Offer</span>
              </div>
            </div>

            <div className='flex flex-wrap gap-6'>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedroom"
                  min='1'
                  max='10'
                  required
                  className='p-3 border-gray-300 rounded-lg'
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min='1'
                  max='10'
                  required
                  className='p-3 border-gray-300 rounded-lg'
                />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min='1'
                  max='10'
                  required
                  className='p-3 border-gray-300 rounded-lg'
                />
                <div className='flex flex-col items-center'>
                  <p>Regular Price</p>
                  <span className='text-xs'>($ / Month)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min='1'
                  max='10'
                  required
                  className='p-3 border-gray-300 rounded-lg'
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  <span className='text-xs'>($ / Month)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className='font-bold'>
              Images:
              <span className='font-normal text-gray-600 ml-2'>The first Image will be cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input
                type="file"
                id="images"
                accept='images/*'
                multiple
                className='p-3 border border-gray-300 rounded w-full' 
                onChange={(e)=>setFiles(e.target.files)}
              />
              <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg'
              onClick={handleImageSubmit}
              type='button'
              disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {
              formData.imageUrls.length > 0 && formData.imageUrls.map((url , index)=>(
                <div className='flex justify-between p-3 border items-center ' key={url}>
             <img src={url} alt="listing Image"  className='w-20 h-20 object-contain rounded-lg' />
             <buttton  type ='button' onClick={()=> handleRemoveImage(index)}
             className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-85 cursor-pointer'>Delete</buttton>
                </div>
               
              ))
            }
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>
              Create Listing
            </button>
          </div>
         
        </form>
    </main>
  )
}

export default CreateListing;
