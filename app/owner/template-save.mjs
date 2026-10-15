export async function persistTemplate(db, salonId, target) {
  const { data, error } = await db.from("salons").update({ template_key: target }).eq("id", salonId).select("id,template_key").maybeSingle();
  if (error) throw error;
  if (!data || data.id !== salonId || data.template_key !== target) {
    const missing = new Error("Template update returned no matching salon row");
    missing.code = "TPL-403";
    throw missing;
  }
  return data;
}