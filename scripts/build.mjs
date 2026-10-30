import {cp,mkdir,writeFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('public','dist',{recursive:true});
const url=process.env.SUPABASE_URL||'',key=process.env.SUPABASE_ANON_KEY||'';
if(Boolean(url)!==Boolean(key))throw Error('Vul zowel SUPABASE_URL als SUPABASE_ANON_KEY in.');
if(url&&new URL(url).protocol!=='https:')throw Error('SUPABASE_URL moet HTTPS gebruiken.');
if(key.startsWith('sb_secret_'))throw Error('Gebruik alleen een publieke anon/publishable key, nooit een secret key.');
if(key.split('.').length===3){try{if(JSON.parse(Buffer.from(key.split('.')[1],'base64url')).role==='service_role')throw Error('Een service_role key mag niet naar de browser.')}catch(e){if(e.message.includes('service_role'))throw e;}}
await writeFile('dist/config.js','window.SALES_CONFIG='+JSON.stringify({url,key})+';\n');
console.log(url?'Build klaar: beveiligde cloudopslag geconfigureerd.':'Build klaar: demonstratiemodus met lokale browseropslag.');
