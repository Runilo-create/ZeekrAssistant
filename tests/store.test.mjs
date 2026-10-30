import test from 'node:test';
import assert from 'node:assert/strict';
import {demo,interpret,apply,Store} from '../public/store.js';
import {readFile} from 'node:fs/promises';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};
test('update links full name, preserves notes and creates Tuesday task',()=>{
 const s=demo();const r=interpret('Demo klant Alex wacht op offerte, bellen dinsdag',s,'2026-10-30');
 assert.equal(r.updates[0].id,1);assert.equal(r.tasks[0].due,'2026-11-03');
 const updated=apply(s,'assistant',r);assert.match(updated.dossiers[0].notes,/Proefrit gehad/);assert.equal(updated.history.length,1);assert.equal(updated.tasks[0].dossier_id,1);assert.equal(s.tasks.length,0);
});
test('unknown and multiple dossiers do not mutate',()=>{const s=demo();for(const text of ['Alex bellen','Demo klant Alex en Demo klant Sam bellen']){const r=interpret(text,s);assert.equal(r.updates.length,0);assert.equal(r.tasks.length,0)}});
test('questions do not mutate and sales need explicit close action',()=>{const s=demo();assert.equal(interpret('Hoe staat Demo klant Alex?',s).updates.length,0);assert.equal(interpret('Demo klant Alex verkocht',s).updates.length,0)});
test('no invented task deadline',()=>{assert.equal(interpret('Demo klant Alex bellen',demo()).tasks[0].due,'')});
test('free task without client',()=>{const r=interpret('Taak: koffie bestellen',demo());assert.equal(r.tasks[0].title,'koffie bestellen');assert.equal(r.tasks[0].dossier_id,null)});
test('demo persistence, closing amount and task completion survive new store',async()=>{
 const storage=memory(),store=new Store({},storage);await store.read();await store.save('close',{id:1,amount_cents:5999900});await store.save('task',{title:'Bel terug',due:'2026-11-03'});
 const fresh=new Store({},storage);let s=await fresh.read();assert.equal(s.dossiers[0].sold,1);assert.equal(s.dossiers[0].amount_cents,5999900);await fresh.save('task',{id:s.tasks[0].id,done:true});s=await new Store({},storage).read();assert.equal(s.tasks[0].done,1);
});
test('reject invalid amounts and missing names',()=>{assert.throws(()=>apply(demo(),'close',{id:1,amount_cents:-1}));assert.throws(()=>apply(demo(),'dossier',{name:''}))});
test('cloud writes use optimistic concurrency and surface conflicts',async()=>{
 const original=globalThis.fetch;const calls=[];globalThis.fetch=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.includes('select=')?[{data:demo(),version:4}]:[]}};
 try{const store=new Store({url:'https://example.supabase.co',key:'public'},memory());store.session={access_token:'test',user:{id:'user'},expires_at:Date.now()/1000+3600};await store.read();await assert.rejects(()=>store.save('task',{title:'test'}),/ander toestel/);assert.ok(calls.some(c=>c.url.includes('version=eq.4')))}finally{globalThis.fetch=original}
});
test('Vercel build contains no screenshot customer data',async()=>{const files=['index.html','app.js','store.js','config.js'];for(const file of files){const text=await readFile('dist/'+file,'utf8');assert.ok(!/04\d{2} \d{2} \d{2} \d{2}/.test(text));assert.ok(!text.includes('@gmail.com'))}});
