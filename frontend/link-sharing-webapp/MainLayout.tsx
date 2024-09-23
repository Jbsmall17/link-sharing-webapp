import React, { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useMyContext } from './src/contextApi'

export default function MainLayout({children}:{children: ReactNode}) {
  const token = sessionStorage.getItem("token")
  const Links = sessionStorage.getItem("links")
  const userInfoStr = sessionStorage.getItem("userInfo")
  const {setLinks,links,userInfo,setUserInfo} = useMyContext()

  useEffect(()=>{
    if(Links && links.length === 0){
    setLinks(JSON.parse(Links))
  }
    if(userInfo._id == "" && userInfoStr){
      setUserInfo(JSON.parse(userInfoStr))
    }
  },[])

  if(!token){
    return <Navigate to="/" />
  }else{
    return (
      <div className='p-2 md:p-4'>
        {children}
      </div>
    )
  }
}
