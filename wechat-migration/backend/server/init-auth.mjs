import {passwordHash} from './api.js';import {mkdirSync,writeFileSync,existsSync} from 'node:fs';
if(existsSync('.local/auth.json'))throw Error('已有密码配置，不覆盖。');
if(!process.env.INIT_HIM||!process.env.INIT_HER)throw Error('请设置 INIT_HIM 和 INIT_HER 环境变量');
const config={};for(const role of ['HIM','HER']){const salt=crypto.randomUUID();config['AUTH_'+role]=salt+':'+await passwordHash(process.env['INIT_'+role],salt);}
mkdirSync('.local',{recursive:true});writeFileSync('.local/auth.json',JSON.stringify(config),{mode:0o600});console.log('密码初始化完成。');
