import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import phoneSvg from "../assets/images/illustration-empty.svg"
import PhoneMockup from '../components/PhoneMockup'
import Link from '../components/Link'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { useMyContext } from '../contextApi'
import {jwtDecode} from "jwt-decode"
import Spinner from '../components/Spinner'

const apiUrl = import.meta.env.VITE_API_URL

interface userInfoType{
  email: string,
  id: string
}

export default function Home() {
  const token = sessionStorage.getItem("token")
  const {links, setLinks, setUserInfo,linkRef} = useMyContext()
  const [isLoading,setIsLoading] = useState(false)
  function addlinks(){
    if(token){
      const userInfoObj : userInfoType = jwtDecode(token)

      setLinks([
        ...links,
        {
          _id: `${links.length}`,
          platform: "",
          link: "",
          userId: userInfoObj.id
        }
      ])
    }

  }

  async function postMultipleLink(){
    setIsLoading(true)
    const newLinkArray = links
    const newLinkArrayMap = newLinkArray.map(({platform,link})=>{
      return {
        platform: platform,
        link: link
      }
    })
    const endpoint = `${apiUrl}/api/link/multiple`
    try{
      const response = await axios.post(endpoint,{
        "links" : newLinkArrayMap
      },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      if(response.status === 201){
        toast.success(response.data.message)
        setIsLoading(false)
      }
      }catch(error : any){
        toast.error(error.response.data.message)
        setIsLoading(false)
      }

    }
  async function getAllUsersLink(){
    const endpoint = `${apiUrl}/api/link/user`
    try{
      const response = await axios.get(endpoint,{
        headers : {
          Authorization : `Bearer ${token}`
        }
      })
      if(response.status === 200){
        setLinks(response.data.data)
        sessionStorage.setItem("links", JSON.stringify(response.data.data))
        linkRef.current = true
      }else{
        setLinks([])
      }
      }catch(error){
        setLinks([])
      }
    }
  async function getUserInfo(){
    if(token){
      const userInfoObj : userInfoType = jwtDecode(token)
      const endpoint = `${apiUrl}/api/user/${userInfoObj.id}`
      try{
        const response = await axios.get(endpoint,{
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
        if(response.status === 200){
          setUserInfo({
            _id: response.data.data._id,
            email: response.data.data.email,
            links : response.data.data.links,
            profilePicture: response.data.data.profilePicture,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName
          })
          const userInfoObj = {
            _id: response.data.data._id,
            email: response.data.data.email,
            links : response.data.data.links,
            profilePicture: response.data.data.profilePicture,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName
          }
          sessionStorage.setItem("userInfo", JSON.stringify(userInfoObj))
        }
      }catch(error){
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
  }
  useEffect(()=>{
    if(!linkRef.current){
      getAllUsersLink()
    }
  },[])

  useEffect(()=>{
    const userInfo =  sessionStorage.getItem("userInfo")
    if(!userInfo){
      getUserInfo()
    }    
  },[])
  return (
    <div className='bg-[#fafafa]'>
      <ToastContainer/>
      <Header  Route={"links"}/>
      <div className='mt-2 md:mt-3 flex flex-row gap-3'>
        <div className='flex-[2] bg-[#ffffff] py-[75px] flex justify-center hidden lg:flex'>
          <PhoneMockup />
        </div>
        <div className='flex-[3] bg-[#ffffff] flex flex-col pt-[30px] md:pt-[50px] px-6 md:px-8 lg:px-6'>
          <p className='font-bold text-xl mb-4'>Customize your links</p>
          <p className='text-base mb-6 text-[#737373]'>Add/edit/remove links below and then share all profiles with the world!</p>
          <button 
            onClick={addlinks}
            className='mb-4 w-full rounded-lg border-[1.5px] border-[#633cff] text-[#633cff] py-2 font-bold hover:bg-[#beadff] transition duration-700'>
            + Add new link
          </button>
          {
            links.length == 0
            ?
              <div className='flex-1 border-b-[1.5px] border-b-[#d9d9d9] py-20 flex flex-col justify-between items-center'>
                <img src={phoneSvg} />
                <p className='font-bold text-xl'>Let's get you started</p>
                <p className='text-[#737373] text-center lg:w-[70%]'>Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them, We're here tp help you share your profiles with everyone</p>
              </div>
            :
              links.map((link, id) => {
                return <Link
                        key={link._id}
                        linkk={link}
                        idProp={id}
                      />   
            })
          }
          <div className='flex justify-end py-4'>
            <button
              disabled={links.length == 0 ? true : false}
              onClick={postMultipleLink}
              className={`rounded-lg w-full md:w-auto text-xs py-2 px-6 text-white ${links.length == 0 ? "bg-[#beadff]": "bg-[#633cff] btn"}`}
            >
              {isLoading ? <Spinner /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
