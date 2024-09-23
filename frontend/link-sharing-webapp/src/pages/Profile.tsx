import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import PhoneMockup from '../components/PhoneMockup'
import {jwtDecode} from "jwt-decode"
import { useMyContext } from '../contextApi'
import {useFormik} from "formik"
import * as Yup from "yup"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import imageCompression from "browser-image-compression";
import Spinner from '../components/Spinner'

interface userInfo{
  email: string,
  id: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Profile() {
  const token = sessionStorage.getItem("token")
  const {setUserInfo,userInfo} = useMyContext()
  const [profileObj,setProfileObj] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    email: ""
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const profileObjValidationSchema = Yup.object({
    profilePicture: Yup.string(),
    firstName: Yup.string().required("can't be empty"),
    lastName: Yup.string().required("can't be empty"),
    email: Yup.string().email("invalid email format")
  })
  const formik = useFormik({
    initialValues: profileObj,
    validationSchema: profileObjValidationSchema,
    onSubmit: async (values)=>{
      setIsLoading(true)
      if(token){
        const userInfoObj : userInfo = jwtDecode(token)
        const endpoint = `${apiUrl}/api/user/${userInfoObj.id}` 
        try{
          const response = await axios.patch(endpoint,values,{
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          if(response.status === 200){
            toast.success(response.data.message)
            setIsLoading(false)
            setUserInfo({
              ...response.data.data
            })
          }
        }catch(error: any){
          toast.error(error.response.data.message)
          setIsLoading(false)
        }
      }
    }
  })

  const handleDivEvent = () =>{
    fileInputRef.current?.click()
  }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>)=>{
    const file = event.currentTarget.files?.[0];
    if (file) {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 500,
        useWebWorker: false
      });
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        console.log(reader.result)
        formik.setFieldValue('profilePicture', reader.result);
      }
  }
}

  const getUserInfo = async()=>{
    formik.setValues({
      profilePicture: userInfo.profilePicture,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email
    })
  }
  const updateProfile = ()=>{
    formik.handleSubmit()
  }

  useEffect(()=>{
    getUserInfo()
  },[userInfo])

  return (
    <div className='bg-[#fafafa]'>
      <ToastContainer />
      <Header Route={'product-details'} />
      <div className='mt-2 mt-3 flex flex-row gap-3'>
        <div className='flex-[2] bg-[#ffffff] py-[75px] flex justify-center hidden lg:flex'>
          <PhoneMockup />
        </div>
        <div className='flex-[3] bg-[#ffffff] flex flex-col pt-[30px] md:pt-[50px] px-6 md:px-8 lg:px-6'>
          <p className='font-bold text-xl mb-4'>Profile details</p>
          <p className='text-base mb-8 text-[#737373]'>Add your details to create a personal touch to your profile.</p>
          <div className='flex-1 border-b-[1.5px] border-b-[#d9d9d9]'>
              <div className='p-2 mb-6 bg-[#fafafa] rounded-lg'>
                <div className='flex flex-col gap-2 md:gap-0  md:flex-row md:items-center'>
                  <p className='flex-1 text-sm text-[#737373]'>Profile picture</p>
                  <div className='flex flex-col md:flex-row gap-4 md:items-center flex-[2]'>
                    <div onClick={handleDivEvent} className='cursor-pointer relative w-[150px] h-[150px] rounded-lg bg-[#efebff] flex justify-center items-center'>
                      <input
                        className='hidden'
                        type='file'
                        name='profilePicture'
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                      />
                      <div className='flex flex-col items-center'>
                          <svg 
                            className={`relative z-10 ${formik.values.profilePicture != "" ? "change-photo" : "upload-photo"}`}  
                            xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"
                          >
                            <path fill="#633CFF" d="M33.75 6.25H6.25a2.5 2.5 0 0 0-2.5 2.5v22.5a2.5 2.5 0 0 0 2.5 2.5h27.5a2.5 2.5 0 0 0 2.5-2.5V8.75a2.5 2.5 0 0 0-2.5-2.5Zm0 2.5v16.055l-4.073-4.072a2.5 2.5 0 0 0-3.536 0l-3.125 3.125-6.875-6.875a2.5 2.5 0 0 0-3.535 0L6.25 23.339V8.75h27.5ZM6.25 26.875l8.125-8.125 12.5 12.5H6.25v-4.375Zm27.5 4.375h-3.34l-5.624-5.625L27.91 22.5l5.839 5.84v2.91ZM22.5 15.625a1.875 1.875 0 1 1 3.75 0 1.875 1.875 0 0 1-3.75 0Z"/>
                          </svg>

                        <p className={`relative z-10 text-sm ${formik.values.profilePicture != "" ? "text-white" : "text-[#633cff]"}`}>
                          {
                            formik.values.profilePicture != ""
                            ? "change photo"
                            : "+ Upload Image"
                          }
                        </p>
                      </div>
                      {
                        formik.values.profilePicture != ""
                        &&
                        <img className='absolute z-0 top-0 left-0 block w-full h-full rounded-lg' src={formik.values.profilePicture} alt='profile picture' />
                      }
                      
                    </div>
                    <p className=' text-sm text-[#737373]'>Image must be below 1024x1024px. Use PNG or JPG format.</p>
                  </div>
                </div>
              </div>
              <div className='p-2 bg-[#fafafa]'>
                  <div className='flex flex-col md:flex-row mb-2 gap-1 md:gap-0 md:items-center'>
                    <div className='flex-1'>
                      <p className='relative inline text-[#737373] text-sm'>
                        First name 
                        <span className='absolute top-0 -right-2 text-[#737373]'>&#42;</span>
                      </p>
                    </div>
                    <div className='relative flex-[2]'>
                    <input 
                      className={`
                         p-2 rounded-lg btn2 outline-none hover:border-[#633cff] 
                        focus:border-[#633cff] transition duration-700 border-[1px] 
                        ${formik.touched.firstName && formik.errors.firstName ? "border-[#FF3939]" : "border-[#d9d9d9]"} w-full`}
                      type="text"
                      name="firstName" 
                      placeholder='e.g john'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}     
                    />
                    {
                      formik.touched.firstName && formik.errors.firstName && 
                      <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.firstName}</span>
                    }
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row mb-2 gap-1 md:gap-0 md:items-center'>
                    <div className='flex-1'>
                      <p className='relative inline text-[#737373] text-sm'>
                        Last name 
                        <span className='absolute top-0 -right-2 text-[#737373]'>&#42;</span>
                      </p>
                    </div>
                    <div className='relative flex-[2]'>
                    <input 
                      className={`
                        p-2 rounded-lg btn2 outline-none hover:border-[#633cff] 
                        focus:border-[#633cff] transition duration-700 border-[1px] 
                        ${formik.touched.lastName && formik.errors.lastName ? "border-[#FF3939]" : "border-[#d9d9d9]"} w-full`} 
                      type="text"
                      name='lastName'
                      placeholder='e.g Appleseed'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                    />
                    {
                      formik.touched.lastName && formik.errors.lastName && 
                      <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.lastName}</span>
                    }
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row mb-2 gap-1 md:gap-0 md:items-center'>
                    <div className='flex-1'>
                      <p className='inline text-[#737373] text-sm'>
                        Email 
                      </p>
                    </div>
                    <div className='relative flex-[2]'>
                    <input 
                      className={`
                        p-2 rounded-lg btn2 outline-none hover:border-[#633cff] 
                        focus:border-[#633cff] transition duration-700 border-[1px] 
                        ${formik.touched.email && formik.errors.email ? "border-[#FF3939]" : "border-[#d9d9d9]"} w-full`}
                      type="text"
                      name='email'
                      placeholder='email@example.com'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      readOnly
                    />
                    {
                      formik.touched.email && formik.errors.email && 
                      <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.lastName}</span>
                    }
                    </div>
                  </div>
              </div>
          </div>
          <div className='flex justify-end py-4'>
            <button 
              onClick={updateProfile} 
              className="btn w-full md:w-auto rounded-lg text-xs py-2 px-6 text-white bg-[#633cff]"
            >
              {isLoading ? <Spinner /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
