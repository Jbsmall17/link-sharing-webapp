import React, { useEffect, useState } from 'react'
import devlinks from "../assets/images/logo-devlinks-large.svg"
import emailSvg from "../assets/images/icon-email.svg"
import passwordSvg from "../assets/images/icon-password.svg"
import { NavLink, useNavigate } from 'react-router-dom'
import * as Yup from "yup"
import {useFormik} from "formik"
import Spinner from '../components/Spinner'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa"

interface loginObjType{
    email: string,
    password: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
    const navigate = useNavigate()
    const [loginObj,setLoginObj] = useState<loginObjType>({
        email: "",
        password: ""
    })
    const [isLoading,setIsLoading] = useState(false)
    const [isDisabled,setIsDisabled] = useState(false)
    const loginObjValidationSchema = Yup.object({
        email: Yup.string().email("invalid email format").required("can't be empty"),
        password: Yup.string().required("please check again")
    })
    const [isPasswordVisible,setIsPasswordVisible] = useState(false)
    const formik = useFormik({
        initialValues: loginObj,
        validationSchema: loginObjValidationSchema,
        onSubmit: (values)=>{
            loginFunc(values)
        }
    })

    async function loginFunc(value:loginObjType){
        const endpoint = `${apiUrl}/api/login`
        setIsLoading(true)
        setIsDisabled(true)
        try{
            const response = await axios.post(endpoint,value)
            setIsLoading(false)
            setIsDisabled(false)
            if(response.status === 200){
                sessionStorage.setItem("token",response.data.token)
                navigate("/home")
            }
        }catch(error:any){
            setIsLoading(false)
            setIsDisabled(false)
            if(error.message != "Network Error"){
                toast.error(error.response.data.message)
            }else{
                toast.error(error.message)
            }
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
          formik.handleSubmit();
        }
      }

      useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
        };
      }, []);
  return (
    <div className='w-[100vw] h-[100vh] flex justify-center items-center'>
        <ToastContainer />
        <div className='w-[90vw] md:w-[60vw] lg:w-[30vw] flex flex-col items-center'>
            <img
                src={devlinks}
                alt="devlinks-logo"
                className='block mb-12 md:mb-16 w-[40%] md:w-[35%]' 
            >
            </img>
            <div className='w-full'>
                <p className='font-bold text-xl'>Login</p>
                <p className='text-sm text-[#737373] mb-6'>Add your details below to get back into the app</p>
                <form onSubmit={formik.handleSubmit}>
                    <label className={`block text-xs mb-1  ${formik.touched.email && formik.errors.email ? "text-[#FF3939]": "text-[#333333]"}`}>Email address</label>
                    <div className='relative mb-4'>
                        <img className='absolute left-2 top-[50%] -translate-y-[50%]' src={emailSvg} alt='email symbol' />
                        <input 
                            className={`btn2 outline-none hover:border-[#633cff] 
                            focus:border-[#633cff] transition duration-700 border-[1px] rounded-lg 
                            ${formik.touched.email && formik.errors.email ? "border-[#FF3939]" : "border-[#d9d9d9]"}  py-2 pl-8 w-full`} 
                            type='text'
                            placeholder='e.g alex@email.com' 
                            name='email'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && 
                            <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.email}</span>}
                    </div>
                    <label className={`block text-xs mb-1 ${formik.touched.password && formik.errors.password ? "text-[#FF3939]": "text-[#333333]"}`}>Password</label>
                    <div className='relative mb-4'>
                        {
                            formik.values.password.length === 0
                            ? <img className='absolute left-2 top-[50%] -translate-y-[50%]' src={passwordSvg} alt='email symbol' />
                            : formik.values.password.length > 0 && !isPasswordVisible
                            ? <FaEyeSlash onClick={()=>setIsPasswordVisible(true)} className='absolute left-2 top-[50%] -translate-y-[50%]' />
                            : <FaEye onClick={()=> setIsPasswordVisible(false)} className='absolute left-2 top-[50%] -translate-y-[50%]' />
                        }
        
                        <input 
                            type={isPasswordVisible ? 'text' : "password"} 
                            className={`btn2 outline-none hover:border-[#633cff] 
                            focus:border-[#633cff] transition duration-700 border-[1px] rounded-lg 
                            ${formik.touched.password && formik.errors.password ? "border-[#FF3939]" : "border-[#d9d9d9]"} py-2 pl-8 w-full`}
                            placeholder='enter your password' 
                            name='password'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && 
                            <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.password}</span>}
                    </div>
                    <button 
                        className='flex justify-center items-center gap-1 btn block text-base rounded-lg text-white w-full text-center py-2 bg-[#655cff] mb-4 transition duration-500' 
                        type='submit'
                        disabled={isDisabled}
                    >
                        {isLoading ? <Spinner /> : <span>Login</span> }
                    </button>
                </form>
                <p className='text-center text-[#737373] text-sm'>Don't have an account?{" "}<NavLink className="text-sm text-[#655cff]" to="/signup">Create acount</NavLink></p>
            </div>
        </div>
    </div>
  )
}
