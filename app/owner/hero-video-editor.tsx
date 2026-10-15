"use client";
import { useEffect, useState } from "react";
import { Film, Image as ImageIcon, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type HeroVideo = { id:string; public_url:string|null; storage_path:string; alt_ar:string|null; alt_en:string|null };
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const VIDEO_TYPES = ["video/mp4","video/webm","video/quicktime"];

export default function HeroVideoEditor({salonId}:{salonId:string}) {
  const [db] = useState(()=>createSupabaseBrowserClient());
  const [video,setVideo] = useState<HeroVideo|null>(null);
  const [mode,setMode] = useState<"image"|"video">("image");
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  useEffect(()=>{let alive=true;(async()=>{const [s,m]=await Promise.all([
    db.from("salons").select("hero_mode").eq("id",salonId).maybeSingle(),
    db.from("media_assets").select("id,public_url,storage_path,alt_ar,alt_en").eq("salon_id",salonId).eq("kind","hero_video").eq("is_active",true).order("created_at",{ascending:false}).limit(1).maybeSingle()
  ]);if(!alive)return;if(!s.error&&s.data?.hero_mode==="video")setMode("video");if(!m.error&&m.data)setVideo(m.data as HeroVideo)})();return()=>{alive=false}},[db,salonId]);
  async function upload(file:File) {
    if(!VIDEO_TYPES.includes(file.type)){setNotice("استخدم MP4 أو WebM أو MOV. / Use MP4, WebM or MOV.");return}
    if(file.size>MAX_VIDEO_SIZE){setNotice("الحد الأقصى للفيديو 100 ميجابايت. / Video limit is 100 MB.");return}
    setBusy(true);setNotice("");
    const path=salonId+"/hero/"+Date.now()+"-"+file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-90);
    try{
      const {data:{user}}=await db.auth.getUser();
      const uploaded=await db.storage.from("salon-public-video").upload(path,file,{contentType:file.type,upsert:false});
      if(uploaded.error)throw uploaded.error;
      const publicUrl=db.storage.from("salon-public-video").getPublicUrl(path).data.publicUrl;
      const inserted=await db.from("media_assets").insert({salon_id:salonId,kind:"hero_video",storage_path:path,public_url:publicUrl,mime_type:file.type,byte_size:file.size,alt_ar:"فيديو الواجهة الرئيسية",alt_en:"Hero video",is_public:true,is_active:true,sort_order:0,created_by:user?.id||null}).select("id,public_url,storage_path,alt_ar,alt_en").single();
      if(inserted.error){await db.storage.from("salon-public-video").remove([path]);throw inserted.error}
      const updated=await db.from("salons").update({hero_mode:"video"}).eq("id",salonId).select("id").maybeSingle();
      if(updated.error||!updated.data){await db.from("media_assets").update({is_active:false}).eq("id",inserted.data.id);throw updated.error||new Error("No salon row returned")}
      setVideo(inserted.data as HeroVideo);setMode("video");setNotice("تم حفظ فيديو الواجهة. / Hero video saved.");
    }catch(error){console.error("[hero-video-editor] upload failed",{salonId,error});setNotice("تعذر حفظ الفيديو. تحقق من الصلاحيات والحجم ثم أعد المحاولة. / Could not save video. Check access and file size.")}
    finally{setBusy(false)}
  }
  async function switchMode(next:"image"|"video"){
    setBusy(true);setNotice("");try{const {data,error}=await db.from("salons").update({hero_mode:next}).eq("id",salonId).select("id").maybeSingle();if(error)throw error;if(!data)throw new Error("No salon row returned");setMode(next);setNotice(next==="image"?"سيتم عرض الصورة الرئيسية. / Hero image selected.":"سيتم عرض الفيديو المحفوظ. / Saved hero video selected.")}catch(error){console.error("[hero-video-editor] mode update failed",{salonId,next,error});setNotice("تعذر تغيير وضع الواجهة. / Could not change hero mode.")}finally{setBusy(false)}}
  return <section className="owner-panel"><div style={{display:"flex",alignItems:"center",gap:8}}><Film size={18}/><h2 style={{margin:0}}>فيديو الواجهة الرئيسية / Hero video</h2></div><p style={{fontSize:12,lineHeight:1.8,color:"#697469"}}>ارفع فيديو قصيرًا بصيغة MP4 أو WebM أو MOV (حتى 100 ميجابايت). يبقى اختيار الصورة متاحًا في أي وقت.</p>{video?.public_url&&<video src={video.public_url} controls muted playsInline style={{display:"block",width:"100%",maxHeight:260,marginBlock:12,borderRadius:10}}/>}<label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{busy?"جارٍ الرفع…":"رفع / استبدال الفيديو"}<input type="file" accept={VIDEO_TYPES.join(",")} disabled={busy} onChange={e=>{const file=e.currentTarget.files?.[0];if(file)void upload(file);e.currentTarget.value=""}}/></label><div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}><button type="button" className="owner-small-primary" disabled={busy||mode==="image"} onClick={()=>switchMode("image")}><ImageIcon size={14}/> استخدام الصورة</button><button type="button" className="owner-small-primary" disabled={busy||!video||mode==="video"} onClick={()=>switchMode("video")}><Film size={14}/> استخدام الفيديو</button></div><p role="status" className="owner-notice">{notice||("الوضع الحالي: "+(mode==="video"?"فيديو":"صورة")+" / Current mode: "+mode)}</p></section>
}
