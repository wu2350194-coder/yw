import {fileURLToPath} from 'node:url';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import vm from 'node:vm';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(dir,d.name)):[path.join(dir,d.name)]);}
for(const f of walk(fileURLToPath(root))){if(f.endsWith('.json'))JSON.parse(fs.readFileSync(f,'utf8'));if(/\.(js|mjs)$/.test(f))execFileSync(process.execPath,['--check',f]);}
const app=JSON.parse(fs.readFileSync(new URL('miniprogram/app.json',root)));
for(const p of app.pages)for(const ext of ['js','json','wxml','wxss'])assert.ok(fs.existsSync(new URL('miniprogram/'+p+'.'+ext,root)));
const source=fs.readFileSync(new URL('miniprogram/utils/api.js',root),'utf8');
let next,requestOptions,downloadOptions,role='him';
const appMock={globalData:{role}};
const context={module:{exports:{}},require:()=>({apiBase:'https://api.example.test'}),getApp:()=>appMock,wx:{request(o){requestOptions=o;o.success(next);},downloadFile(o){downloadOptions=o;o.success({statusCode:200,tempFilePath:'temp.jpg'});},reLaunch(){},getFileSystemManager:()=>({unlink(){}})}};
vm.runInNewContext(source,context);const api=context.module.exports;
next={statusCode:200,header:{},cookies:['journal_session=test-session; HttpOnly'],data:{user:{role:'him'}}};await api.request('/api/auth/login','POST',{});
next={statusCode:200,header:{},data:{entries:[]}};await api.request('/api/diary');assert.equal(requestOptions.header.Cookie,'journal_session=test-session');
await api.media('/photos/photo-7.jpg');assert.equal(downloadOptions.header.Cookie,'journal_session=test-session');
next={statusCode:401,header:{},data:{error:'expired'}};await assert.rejects(api.request('/api/diary'));assert.equal(appMock.globalData.role,null);
console.log('Syntax, JSON, page files and mini-program session transport passed.');
