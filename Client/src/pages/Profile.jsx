import React from 'react'
import {useSelector} from 'react-redux'

function Profile() {
  const {currentUser} = useSelector((state)=> state.user)
  return (
    <div className='p-3  max-w-lg mx-auto  '>
      <h1 className='text-3xl font-bold text-center py-7'>Profile</h1>
      <form className='flex flex-col gap-4 '>
        <img src={currentUser.avatar} alt="profile"  className='self-center rounded-full h-24 w-24 object-cover cursor-pointer mt-2'/>
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