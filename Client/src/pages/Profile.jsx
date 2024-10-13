import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  list,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUSerFailure,
  updateUSerStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFIle] = useState(undefined);
  const [fileperc, setFileperc] = useState(0);
  const [fileuploadError, setFileuploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [showListingsError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  //fire base Storage ::
  // allow read;
  // allow  write :if
  // request.resource.size <2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileperc(Math.round(progress));
      },
      (error) => {
        setFileuploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUSerStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUSerFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUSerFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(logoutUserStart());
      const res = await fetch("api/auth/signout");
      const data = res.json();
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
        return;
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(error);
    }
  };
const handleListingDelete = async (listingId) =>{
  try {
    const res = await fetch(`/api/listing/delete/${listingId}`, {
      method : "DELETE",
    });
    const data = await res.json();
    if(data.success ===false){
        console.log(data.message)
        return;
    }
    setUserListings((prev)=> prev.filter((listing)=> listing._id !==listingId) );
  } catch (error) {
    console.log(error.message)
  }

}
  return (
    <div className="p-3  max-w-lg mx-auto  ">
      <h1 className="text-3xl font-bold text-center py-7">Profile</h1>
      <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFIle(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="self-center rounded-full h-24 w-24 object-cover cursor-pointer mt-2"
        />
        <p className="text-sm self-center">
          {fileuploadError ? (
            <span className="text-red-700">
              File upload error(image must be less than 2mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className="text-slate-700">{`uploading  ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className="text-green-700 ">Image Successfully Uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 uppercase rounded-lg  hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 rounded-lg text-white uppercase text-center hover:opacity-95"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User is Updated Successfully!" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700">
        {showListingsError ? "Error while fetching listings" : ""}
      </p>

      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4"> 
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
 {userListings.map((listing) => (
          <div 

            key={listing._id}
            className="flex border p-3 rounded-lg justify-between items-center gap-4 "
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              to={`/listing/${listing._id}`}
              className="text-slate-700 font-semibold flex-1 hover:underline truncate"
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 uppercase">Edit</button>
              </Link>
              
            </div>
          </div>
        ))}
        </div>}
       
    </div>
  );
}

export default Profile;
