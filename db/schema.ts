import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('sessions',{token:text('token').primaryKey(),role:text('role').notNull(),expires:integer('expires').notNull()});
export const attempts=sqliteTable('attempts',{ip:text('ip').primaryKey(),count:integer('count').notNull(),until:integer('until').notNull()});
export const entries=sqliteTable('entries',{id:text('id').primaryKey(),author:text('author').notNull(),date:text('date').notNull(),title:text('title').notNull(),body:text('body').notNull(),mood:text('mood').notNull(),version:integer('version').notNull().default(1),updated:integer('updated').notNull()});

export const together=sqliteTable('together',{mode:text('mode').primaryKey(),round:integer('round').notNull().default(0),him:text('him'),her:text('her'),plan:integer('plan'),updated:integer('updated').notNull()});
