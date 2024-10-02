import React , {useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'




function SignIn() {
  const [formdata , setFormData] = useState({})
  const [error , setError] = useState(null)
  const [loading , setLoading]=  useState(false)
  const navigate = useNavigate()
  const handleChange = (e) =>{
   setFormData({
    ...formdata , 
    [e.target.id] : e.target.value
   })
  }
  const handleSubmit =async (e) =>{
    e.preventDefault();
    try {
      setLoading(true)
   const res = await fetch('/api/auth/signin' , 
    {
      method : 'POST',
    headers :{
    'Content-Type' : 'application/json ' 
    },
    body : JSON.stringify(formdata)
    }
   )
  const data =await res.json();
 if(!data.success){
  setError(data.message || "SomeThing Went Wrong , Please Try Again Later ")
  setLoading(false)
  return ;
 }
 setLoading(false)
 setError(null)
 navigate('/')
      
    } catch (error) {
      setLoading(false)
      setError(error.message || "An error Occured please try again later")
    }
    
  }
 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7' >Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input type="email" placeholder='email'  id='email' className='border p-3 rounded-lg'  onChange={handleChange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg'  onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80' disabled ={loading} > {loading ? 'Loading ... ' : 'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5 '>
        <p>Dont have an account?</p> 
        <Link to={'/sign-up'}>
        <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignIn