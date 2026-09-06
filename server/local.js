import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
export function localEnvironment(){mkdirSync('.local',{recursive:true});const db=new DatabaseSync('.local/journal.sqlite');db.exec('PRAGMA journal_mode=WAL');db.exec('CREATE TABLE IF NOT EXISTS local_migrations(name TEXT PRIMARY KEY)');for(const n of readdirSync('.openai/drizzle').filter(n=>n.endsWith('.sql')).sort()){if(!db.prepare('SELECT name FROM local_migrations WHERE name=?').get(n)){db.exec(readFileSync(path.join('.openai/drizzle',n),'utf8'));db.prepare('INSERT INTO local_migrations(name) VALUES(?)').run(n);}}
return {...JSON.parse(readFileSync('.local/auth.json','utf8')),DB:{prepare(sql){const s=db.prepare(sql);let args=[];return {bind(...v){args=v;return this;},async first(){return s.get(...args)||null;},async all(){return {results:s.all(...args)};},async run(){const r=s.run(...args);return {meta:{changes:Number(r.changes)}};}};}}};}
