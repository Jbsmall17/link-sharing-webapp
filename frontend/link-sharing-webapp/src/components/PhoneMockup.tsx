import React from 'react'
import Card from './Card'
import { useMyContext } from '../contextApi'




export default function PhoneMockup() {
  const {links, userInfo} = useMyContext()
  function selectingBackgroundColor(platform : string){
    if(platform == "github"){
      return "#333333"
    }else if (platform === "youtube"){
      return "#ff3939"
    }else if(platform == "linkedin" || platform == "facebook"){
      return "#633cff"
    }else{
      return "#333333"
    }
}

  return (
    <div className='flex flex-col border-[1.5px] border-[#d9d9d9] w-[300px] h-[550px] rounded-[2.5rem] p-2'>
        <div className='relative flex flex-row w-full h-[30px]'>
          <div className='absolute w-[10px] h-[1.5px] bg-[#d9d9d9] bottom-0 left-[195px]'></div>
          <div className='w-[60px] h-[30px] border-[1.5px] border-b-0 border-r-0 border-[#d9d9d9] rounded-tl-[2.5rem]'></div>
          <div className='w-[14px] h-[15px] border-[#d9d9d9] border-[1.5px] border-l-0 border-b-0 rounded-tr-lg'></div>
          <div className='w-[17px] -translate-x-[1.5px] h-[15px] border-[#d9d9d9] border-[1.5px] translate-y-[15px] border-t-0 border-r-0 rounded-bl-lg'></div>
          <div className='w-[113px] h-[1.5px] bg-[#d9d9d9] -translate-x-[1.5px] translate-y-[28.75px]'></div>
          <div className='w-[14px] translate-x-[1.5px] h-[15px] border-[#d9d9d9] border-[1.5px] translate-y-[15px] border-t-0 border-l-0 rounded-br-lg'></div>
          <div className='w-[14px] h-[15px] border-[#d9d9d9] border-[1.5px] border-r-0 border-b-0 rounded-tl-lg'></div>
          <div className='w-[60px] h-[30px] border-[1.5px] border-b-0  border-l-0 border-[#d9d9d9] rounded-tr-[2.5rem]'></div>
        </div>
        <div className='flex-1 border-[1.5px] border-t-0 rounded-b-[2.5rem] py-8 px-3 flex flex flex-col items-center gap-[50px]'>
          <div className='flex flex-col items-center'>
            {
              userInfo.profilePicture == ""
              ? <div className='w-[100px] h-[100px] rounded-full bg-[#eeeeee] mb-4 animate-pulse'></div>
              : <img src={userInfo.profilePicture} alt='profile picture' className='block mb-2 w-[100px] h-[100px] rounded-full' />
            }
            {
              userInfo.firstName == "" && userInfo.lastName
              ? <div className='w-[150px] h-[15px] rounded-full bg-[#eeeeee] mb-2 animate-pulse'></div> 
              : <p className='mb-2 text-[#333333] text-xl font-semibold'>{`${userInfo.firstName} ${userInfo.lastName}`}</p>
            }
            {
              userInfo.email == ""
              ? <div className='w-[50px] h-[7.5px] rounded-full bg-[#eeeeee] animate-pulse'></div>
              : <p className='text-sm text-[#737373]'>{userInfo.email}</p> 
            }
            {/* <div className='w-[50px] h-[7.5px] rounded-full bg-[#eeeeee]'></div> */}
          </div>
          <div className='w-full flex flex-col gap-4'>
            {
              links.slice(0,4).map(({platform,link},idx)=>{
                return <Card  widthProp='w-[100%]' linkProp={link} bgColorProp={platform.toLocaleLowerCase()} key={idx} platformProp={platform.toLocaleLowerCase()} />
              })
            }
            {
              links.length == 0
              ? 
              <>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
              </>
              : links.length == 1
              ? 
                <>
                  <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                  <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                  <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                </>
              : links.length == 2
              ? 
              <>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
              </>
              : links.length == 3
              ? 
              <>
                <div className='w-[100%] h-[40px] rounded-xl bg-[#eeeeee] animate-pulse'></div>
              </>
              : <></>
            }
          </div>
        </div>
    </div>
  )
}
