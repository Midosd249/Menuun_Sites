"use client";
import { useEffect } from "react";

export default function LocaleCookieSync({lang}:{lang?:string}) {
  useEffect(()=>{
    if(lang!=="ar"&&lang!=="en")return;
    document.cookie="menuun-locale="+lang+"; Path=/; Max-Age=31536000; SameSite=Lax";
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  },[lang]);
  return null;
}
