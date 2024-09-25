import React, { useEffect } from 'react'
import { useMyContext } from '../contextApi'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Card from '../components/Card'
import { ToastContainer, toast } from 'react-toastify';


const apiUrl = import.meta.env.VITE_API_URL

export default function Preview() {
  const {userInfo, setUserInfo} = useMyContext()
  const {id} = useParams()
  const navigate = useNavigate()
  async function getUserInfo(){ 
    const endpoint = `${apiUrl}/api/${id}`
    try{
      const response = await axios.get(endpoint)
      if(response.status === 200){
        setUserInfo({
          _id: response.data.data._id,
          email: response.data.data.email,
          links : response.data.data.links,
          profilePicture: response.data.data.profilePicture,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName
        })
      } 
    }catch(error:any){
      setUserInfo({
        _id: "",
        email: "",
        links: [],
        profilePicture: "",
        firstName: "",
        lastName: ""
      })
    }
  }

  function copyToClipboard(){
    const currentUrl = window.location.href
    console.log(currentUrl)
    navigator.clipboard.writeText(currentUrl)
    .then(()=>{
      toast.success("copy to clipboard")
    }).catch((err: any)=>{
      toast.error("unable to copy to clipboard")
    })
  }
  useEffect(()=>{
    getUserInfo()
  },[])
  return (
    <div className='w-[100vw] min-h-[100vh] relative overflow-auto'>
        <ToastContainer />
        <div className='p-2 h-auto md:h-[40vh] rounded-b-lg w-full md:bg-[#633cff]'>
          <div className='rounded-lg bg-[#ffffff] py-2 px-2 flex flex-row gap-2 md:gap-0 md:justify-between'>
            <button
              onClick={()=>navigate("/home")} 
              className='flex-1 md:flex-none border-[1.5px] border-[#633cff] py-2 px-4 text-sm text-[#633cff] rounded-lg hover:bg-[#efebff] transition duration-700'>Back to Editor</button>
            <button 
              className='flex-1 md:flex-none border-0 text-sm text-[#fafafa] py-2 px-4 rounded-lg bg-[#633cff] hover:bg-[#beadff] transition duration-700'
              onClick={copyToClipboard}
            >
              Share link
            </button>
          </div>
        </div>
        <div className='md:absolute md:bg-[#ffffff] rounded-lg w-[50%] md:w-[30%] lg:w-[20%] top-[60%] left-[50%] translate-x-[50%] md:-translate-x-[50%] md:-translate-y-[50%] z-10 md:shadow-2xl py-[25px] flex flex-col items-center'>
          {
            userInfo.profilePicture == ""
            ? <div className='w-[80px] h-[80px] rounded-full bg-[#eeeeee] mb-4 animate-pulse'></div>
            : <img src={userInfo.profilePicture} alt="profile picture" className='w-[80px] h-[80px] mb-2 rounded-full' />
          }
          {
            userInfo.firstName == "" && userInfo.lastName
            ? <div className='w-[80%] h-[24px] rounded-lg bg-[#eeeeee] mb-1 animate-pulse'></div> 
            : <p className='text-2xl font-bold'>{`${userInfo.firstName} ${userInfo.lastName}`}</p>
          }
          {
            userInfo.email == ""
            ? <div className='w-[60%] h-[16px] rounded-lg bg-[#eeeeee] mb-6 animate-pulse'></div>
            : <p className='text-[#737373] text-sm mb-4'>{userInfo.email}</p>
          }
          <div className='flex flex-col gap-2 w-full items-center'>
            {
              userInfo.links.length > 0
              ? 
                userInfo.links.map(({platform, link},idx)=>{
                  return <Card widthProp='w-full md:w-[80%]' linkProp={link} bgColorProp={platform.toLocaleLowerCase()} key={idx} platformProp={platform.toLocaleLowerCase()} />
                })
              : <>
                  <div className='w-[80%] h-[32px] rounded-lg bg-[#eeeeee] animate-pulse'></div>
                  <div className='w-[80%] h-[32px] rounded-lg bg-[#eeeeee] animate-pulse'></div>
                  <div className='w-[80%] h-[32px] rounded-lg bg-[#eeeeee] animate-pulse'></div>
                </>
            }
          </div>
        </div>
    </div>
  )
}
