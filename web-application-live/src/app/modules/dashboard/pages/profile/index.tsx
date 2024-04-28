import React, { ReactElement, useEffect, useState } from "react";
import { getFromLocalStorage } from "localStorage";
import BrandProfile from "./brandProfile";
import ServiceProfile from "./serviceProfile";


export default function Profile() : ReactElement {
 const [profile, setProfile] =useState<string>("");
 
    useEffect(()=>{
        const userRole = getFromLocalStorage("userRole");
        if (userRole) {
           setProfile(userRole);
        }
        
    },[]) 


if(profile==="brand"){
      return <BrandProfile/>;
 }else{
      return <ServiceProfile/>;
 }

}
