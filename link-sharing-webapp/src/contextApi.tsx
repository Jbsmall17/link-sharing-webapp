import React, { Dispatch, MutableRefObject, ReactNode, SetStateAction, useContext, useRef, useState } from "react";

interface myContextData{
    count: number,
    setCount: Dispatch<SetStateAction<number>>,
    links: linkObj[],
    setLinks: Dispatch<SetStateAction<linkObj[]>>,
    userInfo: userInfoObj,
    setUserInfo: Dispatch<SetStateAction<userInfoObj>>,
    linkRef: MutableRefObject<boolean>
}

interface linkObj{
    _id: string,
    platform: string,
    link: string,
    userId: string
  }

interface userInfoObj {
    _id: string,
    email: string,
    links: linkObj[],
    profilePicture: string,
    firstName : string,
    lastName: string
}
const myContext = React.createContext<myContextData | undefined>(undefined)

export function ContextComp({children}:{children : ReactNode}){
    const [count,setCount] = useState(0)
    const [links,setLinks] = useState<linkObj[]>([])
    const [userInfo,setUserInfo] = useState<userInfoObj>({
        _id: "",
        email: "",
        links: [],
        profilePicture: "",
        firstName: "",
        lastName: ""
    })
    const linkRef= useRef(false)
    return (
        <myContext.Provider
            value={{count,setCount,links,setLinks,userInfo,setUserInfo, linkRef}}
        >
            {children}
        </myContext.Provider>
    )

}

export function useMyContext(){
    const contextObject = useContext(myContext)
    if(!contextObject){
        throw new Error("context must be defined")
    }
    else{
        return contextObject
    }
}