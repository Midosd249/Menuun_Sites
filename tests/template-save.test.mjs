import test from "node:test";
import assert from "node:assert/strict";
import { persistTemplate } from "../app/owner/template-save.mjs";
function mockedClient(result) {
 const calls=[];
 return { calls, db:{from(table){calls.push(["from",table]);return {update(payload){calls.push(["update",payload]);return {eq(column,value){calls.push(["eq",column,value]);return {select(columns){calls.push(["select",columns]);return {maybeSingle:async()=>result}}}}}}}}};
}
test("matching Supabase row resolves successfully",async()=>{const {db,calls}=mockedClient({data:{id:"salon-1",template_key:"oasis"},error:null});assert.deepEqual(await persistTemplate(db,"salon-1","oasis"),{id:"salon-1",template_key:"oasis"});assert.deepEqual(calls[0],["from","salons"]);});
test("zero-row update rejects with TPL-403",async()=>{const {db}=mockedClient({data:null,error:null});await assert.rejects(()=>persistTemplate(db,"salon-1","rose"),e=>e.code==="TPL-403");});
test("Supabase error object is preserved",async()=>{const error=Object.assign(new Error("permission denied"),{code:"42501"});const {db}=mockedClient({data:null,error});await assert.rejects(()=>persistTemplate(db,"salon-1","atelier"),e=>e===error);});
