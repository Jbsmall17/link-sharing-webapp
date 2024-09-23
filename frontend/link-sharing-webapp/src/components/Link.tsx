import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import github from "../assets/images/icon-github.svg"
import youtube from "../assets/images/icon-youtube.svg"
import linkedin from "../assets/images/icon-linkedin.svg"
import facebook from "../assets/images/icon-facebook.svg"
import frontendMentor from "../assets/images/icon-frontend-mentor.svg"
import chevron from "../assets/images/icon-chevron-down.svg"
import dragNdrop from "../assets/images/icon-drag-and-drop.svg"
import linkSvg from "../assets/images/icon-link.svg"
import * as Yup from "yup"
import { useMyContext } from '../contextApi'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { FaXTwitter, FaInstagram } from "react-icons/fa6";

interface linkObj{
    _id:string
    platform: string,
    link: string,
    userId: string
}


interface linkObjProp{
    idProp: number,
    linkk: linkObj
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Link({linkk,idProp}:linkObjProp) {
    const token = sessionStorage.getItem("token")
    const {setLinks} = useMyContext()
    const [toggle,setToggle] = useState(false)
    const [option,setOption] = useState(linkk.platform.toLowerCase() || "github")
    const [linkObj,setLinkObj] = useState({
        link: linkk.link
    })
    const linkRef = useRef({
        value: false,
        isTouched: false
    })

    const validationSchema = Yup.object({
        link: Yup.string()
        .url('Please enter a valid URL')
        .required('URL is required')
    })



    const {link} = linkObj

    function handleBlur(){
        validationSchema
        .validate(linkObj)
        .then(()=>{
            linkRef.current = {
                value: true,
                isTouched: false
            }
        }).catch(()=>{
            linkRef.current = {
                value: false,
                isTouched: false
            }
        })
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target
        validationSchema
        .validate({
            [name] : value
        })
        .then(()=>{
            linkRef.current = {
                value: true,
                isTouched: true
            }
        }).catch(()=>{
            linkRef.current = {
                value: false,
                isTouched: true
            }
        })

        setLinkObj({
            ...linkObj,
            [name]: value
        })
    }

    function handleToggle(){
        setToggle(!toggle)
    }

    function handleOption(option : string){
        setOption(option)
        setToggle(false)
    }

    function selectingIcon(){
        if(option == "github"){
            return github
        }else if (option === "youtube"){
            return youtube
        }else if(option == "linkedin"){
            return linkedin
        }else if(option == "facebook"){
            return facebook
        }else{
            return frontendMentor
        }
    }
    async function removeLink(){
        const endpoint = `${apiUrl}/api/link/${linkk._id}`
        const Interger =  parseInt(linkk._id)
        if(!Interger && Interger != 0){
            try{
                const response = await axios.delete(endpoint,{
                    headers :{
                        Authorization : `Bearer ${token}`
                    }
                })
                if(response.status === 200){
                    setLinks(prevLinks => prevLinks.filter((_, id) => idProp !== id));
                    toast.success(response.data.message)
                }
            }catch(error:any){
                toast.error(error.response.data.message)
            }
        }else{
            setLinks(prevLinks => prevLinks.filter((_, id) => idProp !== id));
            toast.success("Link successfully deleted")
        }
    }

    useEffect(() => {
        setLinks(prevLinks => {
            const newLinks = [...prevLinks];
            newLinks[idProp] = { _id: linkk._id ,platform: option, link: link, userId: linkk.userId };
            return newLinks;
        });
    }, [option, link, setLinks, idProp]);

    useEffect(() => {
        setLinkObj({ link: linkk.link });
        setOption(linkk.platform.toLocaleLowerCase() || "github")
    }, [linkk.link]);    

  return (
    <div className='p-2 mb-2 bg-[#fafafa] rounded-lg'>
        <ToastContainer />
        <div className='flex flex-row justify-between'>
            <div className='flex flex-row gap-1'>
                <img
                    src={dragNdrop}
                    alt='drag-n-drop'
                />
                <p className='text-[#737373] text-base font-bold'>Link #{idProp + 1}</p>
            </div>
            <p className='text-base text-[#737373] cursor-pointer' onClick={removeLink}>Remove</p>
        </div>
        <p className='text-sm text-[#737373] mb-1'>Platform</p>
        <div className='w-full relative'>
            <button onClick={handleToggle} className='btn2 mb-2 relative flex rounded-lg w-full pl-8 p-2 border-[1.5px] border-[#d9d9d9] transition duration-700 hover:border-[#beadff]'>
                {
                    option == "twitter"
                    ? <FaXTwitter className='absolute top-[50%] left-2 -translate-y-[50%]' />
                    : option == "instagram"
                    ? <FaInstagram className='absolute top-[50%] left-2 -translate-y-[50%]' />  
                    :<img
                            className='absolute top-[50%] left-2 -translate-y-[50%]'
                            src={selectingIcon()}
                            alt={option}
                        /> 
                }
                <span>{option}</span>
                <img 
                    className={`absolute top-[50%] right-2 -translate-y-[50%] transition dutration-700 ease-in-out ${!toggle ? "rotate-0": "rotate-180"}`}
                    src={chevron}
                    alt='chevron'
                />
            </button>
            {
                toggle
                &&
                <ul className='dropdown z-10 absolute rounded-lg w-[100%] top-[53.5px] left-0 border-[1.5px] border-[#d9d9d9] bg-[#ffffff] px-2 divide-y divide-[#d9d9d9]'>
                    <li
                        onClick={()=>handleOption("github")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><g clipPath="url(#a)">
                            <path fill="#737373"  d="M9.982 2.288a8.756 8.756 0 0 0-3.963 0c-.754-.462-1.329-.674-1.747-.764a2.315 2.315 0 0 0-.544-.056 1.342 1.342 0 0 0-.247.03l-.01.002-.005.002h-.003l.146.513-.146-.512a.533.533 0 0 0-.342.294 3.328 3.328 0 0 0-.17 2.241 3.578 3.578 0 0 0-.817 2.287c0 1.657.488 2.77 1.321 3.486.584.501 1.292.768 2.002.92a2.496 2.496 0 0 0-.123 1.022v.638c-.434.09-.735.062-.95-.008-.267-.089-.473-.267-.67-.523a5.118 5.118 0 0 1-.289-.429l-.06-.099a9.772 9.772 0 0 0-.24-.378c-.202-.3-.503-.675-.99-.803l-.515-.135-.271 1.032.516.136c.085.021.196.101.379.369.07.106.137.213.202.322l.073.117c.1.162.215.342.349.517.27.352.637.707 1.184.887.373.124.797.154 1.282.079v1.992a.533.533 0 0 0 .533.533h4.267a.533.533 0 0 0 .533-.534v-3.8c0-.336-.015-.644-.11-.931.707-.15 1.41-.416 1.99-.918.833-.72 1.32-1.845 1.32-3.511v-.001a3.578 3.578 0 0 0-.82-2.267 3.328 3.328 0 0 0-.169-2.24.533.533 0 0 0-.34-.295l-.146.512c.146-.512.145-.512.144-.512l-.002-.001-.005-.002-.01-.003a1.344 1.344 0 0 0-.248-.03 2.318 2.318 0 0 0-.544.057c-.417.09-.992.302-1.745.764Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                        <span>GitHub</span>
                    </li>
                    <li
                        onClick={()=>handleOption("youtube")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#737373" d="M8.162 2.667c.356.002 1.247.01 2.194.048l.336.015c.952.045 1.904.122 2.377.253.63.177 1.125.693 1.292 1.348.267 1.04.3 3.068.304 3.56V8.107c-.004.491-.037 2.52-.304 3.56a1.874 1.874 0 0 1-1.292 1.347c-.473.131-1.425.209-2.377.253l-.336.016c-.947.037-1.838.046-2.194.048h-.326c-.754-.004-3.904-.038-4.907-.317a1.875 1.875 0 0 1-1.292-1.348c-.267-1.04-.3-3.068-.304-3.56v-.216c.004-.492.037-2.52.304-3.56A1.872 1.872 0 0 1 2.93 2.984c1.002-.28 4.153-.313 4.906-.317h.326Zm-1.496 3v4.666l4-2.333-4-2.333Z"/></svg>
                        <span>Youtube</span>
                    </li>
                    <li
                        onClick={()=>handleOption("linkedin")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#737373" d="M12.667 2A1.333 1.333 0 0 1 14 3.333v9.334A1.334 1.334 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V3.333A1.333 1.333 0 0 1 3.333 2h9.334Zm-.334 10.333V8.8a2.173 2.173 0 0 0-2.173-2.173c-.567 0-1.227.346-1.547.866v-.74h-1.86v5.58h1.86V9.047a.93.93 0 1 1 1.86 0v3.286h1.86ZM4.587 5.707a1.12 1.12 0 0 0 1.12-1.12 1.124 1.124 0 1 0-1.12 1.12Zm.926 6.626v-5.58H3.667v5.58h1.846Z"/></svg>
                        <span>LinkedIn</span>
                    </li>
                    <li
                        onClick={()=>handleOption("facebook")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><g clipPath="url(#a)"><path fill="#737373" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
                        <span>Facebook</span>
                    </li>
                    <li
                        onClick={()=>handleOption("frontend mentor")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#737373" d="M15.512 8.388a.448.448 0 0 1-.2-.047l-4.188-2.098a.509.509 0 0 1-.21-.202.594.594 0 0 1 0-.593.509.509 0 0 1 .21-.202l4.189-2.091a.442.442 0 0 1 .373-.011c.12.052.219.155.271.287a.607.607 0 0 1 .01.418.527.527 0 0 1-.257.303l-3.19 1.593 3.191 1.599c.102.05.185.14.236.25.05.112.066.24.043.362a.559.559 0 0 1-.17.31.457.457 0 0 1-.308.122ZM9.804 16c-4.605 0-8.63-3.477-9.788-8.456a.602.602 0 0 1 .051-.414.498.498 0 0 1 .298-.252.443.443 0 0 1 .37.057.543.543 0 0 1 .225.333c.51 2.19 1.656 4.127 3.256 5.51 1.6 1.382 3.566 2.131 5.588 2.13.13 0 .253.058.345.16a.58.58 0 0 1 .143.386.58.58 0 0 1-.143.386.463.463 0 0 1-.345.16ZM8.123 11.467a.463.463 0 0 1-.345-.16.58.58 0 0 1-.143-.385V.546A.58.58 0 0 1 7.778.16.463.463 0 0 1 8.123 0c.13 0 .253.058.345.16a.58.58 0 0 1 .143.386v10.376a.58.58 0 0 1-.143.386.463.463 0 0 1-.345.16Z"/></svg>
                        <span>frontend Mentor</span>
                    </li>
                    <li
                        onClick={()=>handleOption("twitter")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <FaXTwitter />
                        <span>twitter</span>
                    </li>
                    <li
                        onClick={()=>handleOption("instagram")}
                        className='cursor-pointer py-2 flex gap-2 items-center text-[#737373] hover:text-[#633cff]'
                    >
                        <FaInstagram />
                        <span>instagram</span>
                    </li>
                </ul>
            }
        </div>
        <p className='text-sm text-[#737373] mb-1'>Link</p>
        <div className='w-full relative'>
            <img
                className='absolute top-[50%] left-2 -translate-y-[50%]'
                src={linkSvg}
                alt='link'
            />
            <input
                className={`
                    btn2 outline-none rounded-lg w-full pl-8 p-2 border-[1.5px] 
                    ${!linkRef.current.value && linkRef.current.isTouched ? "border-[#FF3939]": "border-[#d9d9d9]"} transition duration-700 hover:border-[#beadff]`} 
                type='text' 
                placeholder='e.g https//:www.github.com/johnappleseed'
                value={link}
                name='link'
                onChange={handleChange}
                onBlur={handleBlur}
            >
            </input>
        </div>
    </div>
  )
}
