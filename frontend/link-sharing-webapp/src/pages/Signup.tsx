import Spinner from "../components/Spinner"
import devlinks from "../assets/images/logo-devlinks-large.svg"
import emailSvg from "../assets/images/icon-email.svg"
import passwordSvg from "../assets/images/icon-password.svg"
import { NavLink, useNavigate } from 'react-router-dom'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface signUpObjType{
    email: string,
    password: string,
    confirmPassword: string
}


const apiUrl = import.meta.env.VITE_API_URL

export default function Signup() {
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    const [isDisabled,setsetIsDisabled] = useState(false)
    const [signUpObj,setSignUpObj] = useState<signUpObjType>({
        email: "",
        password: "",
        confirmPassword: ""
    }) 

    const signUpValidationSchema = Yup.object({
        email: Yup.string().email("Invalid email format").required("email is required"),
        password: Yup.string()
        .required("password is required")
        .matches(/.{8,}/, "Must contain at least 8 letters"),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref("password", undefined), undefined] as const, "Passwords must match")
        .required("Passwords must match")
    })

    const formik = useFormik({
        initialValues: signUpObj,
        validationSchema: signUpValidationSchema,
        onSubmit :(values)=>{
            signUpFunc(values)
        }
    })

    async function signUpFunc(value:signUpObjType){
        const endpoint = `${apiUrl}/api/signup`
        setIsLoading(true)
        setsetIsDisabled(true)
        try{
            const response = await axios.post(endpoint,value)
            setsetIsDisabled(false)
            setIsLoading(false)
            if(response.status === 201){
                sessionStorage.setItem("token",response.data.token)
                navigate("/home")
            }
        }catch(error : any){
            console.log(error)
            toast.success(error.response.data.message)
            setsetIsDisabled(false)
            setIsLoading(false)
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
            className='block mb-12 md:mb-12 w-[40%] md:w-[35%]' 
        />
        <div className='w-full'>
            <p className='font-bold text-xl'>Create account</p>
            <p className='text-sm text-[#737373] mb-4'>Let's get you started sharing your links!</p>
            <form  onSubmit={formik.handleSubmit}>
                <label htmlFor='email' className={`block text-xs mb-1 ${formik.touched.email && formik.errors.email ? "text-[#FF3939]": "text-[#333333]"}`}>Email address</label>
                <div className='relative mb-3'>
                    <img className='absolute left-2 top-[50%] -translate-y-[50%]' src={emailSvg} alt='email symbol' />
                    <input 
                        className={`btn2 outline-none
                            hover:border-[#633cff] focus:border-[#633cff] 
                            transition duration-700 border-[1px] rounded-lg 
                            ${formik.touched.email && formik.errors.email ? "border-[#FF3939]" : "border-[#d9d9d9]"} py-2 pl-8 w-full`} 
                        id='email' 
                        type="text" 
                        placeholder='eg alex@gmail.com' 
                        onChange={formik.handleChange}
                        name="email"
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        />
                    {formik.touched.email && formik.errors.email && 
                    <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.email}</span>}
                </div>
                <label htmlFor="password" className={`block text-xs mb-1 ${formik.touched.password && formik.errors.password ? "text-[#FF3939]": "text-[#333333]"}`}>Create password</label>
                <div className='relative mb-3'>
                    <img className='absolute left-2 top-[50%] -translate-y-[50%]' src={passwordSvg} alt='password symbol' />
                    <input 
                        className={`btn2 outline-none hover:border-[#633cff] focus:border-[#633cff] 
                            transition duration-700 border-[1px] rounded-lg 
                            ${formik.touched.email && formik.errors.email ? "border-[#FF3939]" : "border-[#d9d9d9]"} py-2 pl-8 w-full`}
                        type="password"
                        id='password' 
                        placeholder='At least 8 characters' 
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                </div>
                <label htmlFor="c-password" className={`block text-xs mb-1 ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "text-[#FF3939]": "text-[#333333]"}`}>Confirm password</label>
                <div className='relative mb-3'>
                    <img className='absolute left-2 top-[50%] -translate-y-[50%]' src={passwordSvg} alt='password symbol' />
                    <input 
                        className={`btn2 outline-none hover:border-[#633cff] focus:border-[#633cff] 
                            transition duration-700 border-[1px] rounded-lg w-full
                            ${formik.touched.email && formik.errors.email ? "border-[#FF3939]" : "border-[#d9d9d9]"} py-2 pl-8 w-full1`}  
                        type="password" 
                        id='c-password' 
                        placeholder='At least 8 characters' 
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && 
                    <span className="absolute text-sm top-[50%] right-2 -translate-y-[50%] text-[#FF3939]">{formik.errors.confirmPassword}</span>}
                </div>
               <p className={`text-xs ${formik.touched.password && formik.errors.password ? "text-[#FF3939]" : "text-[#737373]"} mb-4`}>Password must contain at least 8 characters</p>
                <button 
                    type='submit' 
                    disabled={isDisabled}
                    className='flex justify-center items-center gap-1 btn block text-base rounded-lg text-white w-full text-center py-2 bg-[#655cff] transition duration-500 mb-3'>
                    <span>Create new account</span>
                    {isLoading && <Spinner />}
                    </button>
            </form>
            <p className='text-center text-[#737373] text-sm'>Already have an account?{" "}<NavLink className="text-sm text-[#655cff]" to="/">Login</NavLink></p>
        </div>
        </div>
    </div>
  )
}
