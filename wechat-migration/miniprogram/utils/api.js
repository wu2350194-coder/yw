const config=require('../config');
let cookie='';
const tempFiles=[];
function base(){if(!config.apiBase.startsWith('https://'))throw Error('请先在 config.js 配置 HTTPS 服务域名');return config.apiBase.endsWith('/')?config.apiBase.slice(0,-1):config.apiBase;}
function clear(){cookie='';getApp().globalData.role=null;tempFiles.splice(0).forEach(filePath=>wx.getFileSystemManager().unlink({filePath,fail(){}}));}
function request(path,method='GET',data){return new Promise((resolve,reject)=>{let url;try{url=base()+path;}catch(e){return reject(e);}
wx.request({url,method,data,timeout:15000,header:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},success(r){
const raw=(r.cookies||[]).join(';')||r.header['Set-Cookie']||r.header['set-cookie']||'';
const match=raw.match(/journal_session=([^;]+)/);if(match)cookie='journal_session='+match[1];
if(r.statusCode===401){clear();wx.reLaunch({url:'/pages/login/index'});}
if(r.statusCode<200||r.statusCode>=300)return reject(Error(r.data.error||'服务返回错误 '+r.statusCode));
resolve(r.data);
},fail(){reject(Error('连接失败，请检查服务域名和网络'));}});});}
function media(path){return new Promise((resolve,reject)=>{let url;try{url=base()+path;}catch(e){return reject(e);}wx.downloadFile({url,header:{Cookie:cookie},timeout:60000,success(r){if(r.statusCode!==200)return reject(Error('照片或视频加载失败，请重新登录'));tempFiles.push(r.tempFilePath);resolve(r.tempFilePath);},fail(){reject(Error('资源下载失败'));}});});}
module.exports={request,media,clear};
