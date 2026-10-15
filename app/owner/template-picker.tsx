"use client";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Palette, RefreshCw } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTemplateState } from "./template-state";

const templates = [
  { id: "atelier", name: "Atelier", label: "تحريري داكن", description: "أسود فحمي ولمسات ليمونية ومساحات فنية." },
  { id: "oasis", name: "Oasis", label: "طبيعي هادئ", description: "ألوان عاجية وخضراء، بطاقات ناعمة وتركيز على الصور." },
  { id: "rose", name: "Forge Men", label: "فورج للرجال", description: "فحمي عميق، زيتوني هادئ، ولمسات نحاسية راقية." },
] as const;
type TemplateKey = typeof templates[number]["id"];
const validTemplate = (value: string): value is TemplateKey => templates.some(template => template.id === value);
function friendlyError(error: unknown) {
  const e = error as { code?: string; status?: number; message?: string } | null;
  const code = e?.status === 401 || e?.status === 403 || e?.code === "42501" || e?.code === "TPL-403" ? "TPL-403"
    : e?.code === "PGRST116" ? "TPL-404" : "TPL-500";
  return { code, message: code === "TPL-403" ? "لا توجد صلاحية لحفظ القالب. / You don’t have permission to save this template."
    : code === "TPL-404" ? "لم يتم العثور على الصالون. حدّث الصفحة ثم أعد المحاولة. / Salon not found. Refresh and try again."
    : "تعذر حفظ القالب الآن. أعد المحاولة. / Could not save the template. Please retry." };
}

export default function TemplatePicker({ salonId, slug, selected, onSaved }: { salonId: string; slug: string; selected: string; onSaved: (value: TemplateKey) => void }) {
  const { setTemplateKey } = useTemplateState();
  const router = useRouter();
  const confirmed = validTemplate(selected) ? selected : "atelier";
  const [choice, setChoice] = useState<TemplateKey>(confirmed);
  const [failedChoice, setFailedChoice] = useState<TemplateKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const value = validTemplate(selected) ? selected : "atelier";
    setChoice(value); setFailedChoice(null); setTemplateKey(value);
  }, [salonId, selected, setTemplateKey]);

  async function save(target: TemplateKey = choice) {
    if (busy) return;
    const previous = confirmed;
    setBusy(true); setNotice(""); setChoice(target); setTemplateKey(target);
    try {
      const db = createSupabaseBrowserClient();
      const { data, error } = await db.from("salons").update({ template_key: target } as any).eq("id", salonId).select("id,template_key").maybeSingle();
      if (error) throw error;
      if (!data || data.id !== salonId || data.template_key !== target) {
        const missing = new Error("Template update returned no matching salon row");
        (missing as Error & { code: string }).code = "TPL-403";
        throw missing;
      }
      setChoice(target); setFailedChoice(null); setTemplateKey(target);
      onSaved(target);
      setNotice("تم حفظ القالب بنجاح. / Template saved.");
      router.refresh();
    } catch (error) {
      console.error("[template-picker] save failed", { salonId, slug, target, error });
      const friendly = friendlyError(error);
      setChoice(previous); setTemplateKey(previous); setFailedChoice(target);
      setNotice(`${friendly.message} (${friendly.code})`);
    } finally { setBusy(false); }
  }

  return <section className="owner-panel">
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Palette size={19}/><h2 style={{margin:0}}>تصميم صفحة الصالون</h2></div>
    <p style={{fontSize:12,color:"#697469",lineHeight:1.9,marginTop:0}}>اختر أحد القوالب الثلاثة. اختيار القالب لا يغيّر خدماتك أو مواعيدك.</p>
    <div className="menuun-template-grid">{templates.map(template=><button type="button" key={template.id} onClick={()=>setChoice(template.id)} aria-pressed={choice===template.id} className={"menuun-template-card menuun-template-"+template.id+(choice===template.id?" is-selected":"")}>
      <span className="menuun-template-preview" aria-hidden="true"><i/><i/><i/></span><strong>{template.name}</strong><small>{template.label}</small><span className="menuun-template-description">{template.description}</span>{choice===template.id&&<span className="menuun-template-check"><Check size={14}/> محدد</span>}<a className="menuun-template-preview-link" href={"/s/"+encodeURIComponent(slug)+"?template="+encodeURIComponent(template.id)} target="_blank" rel="noreferrer"><ExternalLink size={12}/> معاينة القالب</a>
    </button>)}</div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14,flexWrap:"wrap"}}>
      <button type="button" className="owner-primary" disabled={busy} onClick={()=>save()}>{busy?"جارٍ الحفظ…":"حفظ القالب"}</button>
      {failedChoice && <button type="button" className="owner-small-primary" disabled={busy} onClick={()=>save(failedChoice)}><RefreshCw size={14}/> إعادة المحاولة / Retry</button>}
      {notice&&<span role="status" style={{fontSize:12,color:notice.includes("TPL-")?"#9b2c2c":"#36533d"}}>{notice}</span>}
    </div>
  </section>;
}
