"use client";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Palette } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useTemplateState } from "./template-state";

const templates = [
  { id: "atelier", name: "Atelier", label: "تحريري داكن", description: "أسود فحمي ولمسات ليمونية ومساحات فنية." },
  { id: "oasis", name: "Oasis", label: "طبيعي هادئ", description: "ألوان عاجية وخضراء، بطاقات ناعمة وتركيز على الصور." },
  { id: "rose", name: "Forge Men", label: "فورج للرجال", description: "فحمي عميق، زيتوني هادئ، ولمسات نحاسية راقية." },
] as const;
type TemplateKey = typeof templates[number]["id"];

export default function TemplatePicker({ salonId, slug, selected, onSaved }: { salonId: string; slug: string; selected: string; onSaved: (value: TemplateKey) => void }) {
  const { setTemplateKey } = useTemplateState();
  const [choice, setChoice] = useState<TemplateKey>(templates.some(t => t.id === selected) ? selected as TemplateKey : "atelier");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => { const value = templates.some(t => t.id === selected) ? selected as TemplateKey : "atelier"; setChoice(value); setTemplateKey(value); }, [salonId, selected, setTemplateKey]);
  async function save() {
    if (busy) return;
    setBusy(true); setNotice("");
    try {
      const db = createSupabaseBrowserClient();
      const { data, error } = await db.from("salons").update({ template_key: choice } as any).eq("id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لتعديل هذا الصالون.");
      onSaved(choice);
      setTemplateKey(choice);
      setNotice("تم حفظ القالب. ستظهر التغييرات في صفحة الصالون.");
    } catch (error: any) {
      setNotice(error?.message || "تعذر حفظ القالب.");
    } finally { setBusy(false); }
  }
  return <section className="owner-panel">
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Palette size={19}/><h2 style={{margin:0}}>تصميم صفحة الصالون</h2></div>
    <p style={{fontSize:12,color:"#697469",lineHeight:1.9,marginTop:0}}>اختر أحد القوالب الثلاثة. اختيار القالب لا يغيّر خدماتك أو مواعيدك.</p>
    <div className="menuun-template-grid">{templates.map(template=><button type="button" key={template.id} onClick={()=>setChoice(template.id)} aria-pressed={choice===template.id} className={"menuun-template-card menuun-template-"+template.id+(choice===template.id?" is-selected":"")}>
      <span className="menuun-template-preview" aria-hidden="true"><i/><i/><i/></span><strong>{template.name}</strong><small>{template.label}</small><span className="menuun-template-description">{template.description}</span>{choice===template.id&&<span className="menuun-template-check"><Check size={14}/> محدد</span>}<a className="menuun-template-preview-link" href={"/s/"+encodeURIComponent(slug)+"?template="+encodeURIComponent(template.id)} target="_blank" rel="noreferrer"><ExternalLink size={12}/> معاينة القالب</a>
    </button>)}</div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14,flexWrap:"wrap"}}><button type="button" className="owner-primary" disabled={busy} onClick={save}>{busy?"جارٍ الحفظ…":"حفظ القالب"}</button>{notice&&<span role="status" style={{fontSize:12,color:"#36533d"}}>{notice}</span>}</div>
  </section>;
}
