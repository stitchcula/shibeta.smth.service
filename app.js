/**
 * Created by stitchcula on 2016/4/11.
 */

import Koa from 'koa'
import Router from 'koa-router'
import mongo from 'koa-mongo'
import convert from 'koa-convert'
import serve from 'koa-static'

var redis=require('co-redis')((()=>{
    var _=require('redis').createClient(
        process.env['REDIS_PORT'],
        process.env['REDIS_HOST']);
    _.auth(process.env['REDIS_AUTH']);
    return _
})())

const router=new Router()
var routes=require('dir-requirer')(__dirname)('./routes')
for(var r in routes){
    router.use('/'+r,routes[r].router.routes())
}

const app=new Koa()
app.use(async (ctx,next)=>{
    console.log(ctx.ip+" "+ctx.method+" "+ctx.path+" at "+new Date().toLocaleString())
    ctx.redis=redis
    try{
        await next()
    }catch(err){
        console.error(err)
        if(typeof(err)=='string'&&err.length==3)
            ctx.body=err
        else if(typeof(err)=='number'&&err.length==3)
            ctx.status=err
        else
            ctx.body="500"
    }
})
/*
app.use(convert(mongo({
    host:process.env['MONGO_HOST']||'localhost',
    port:process.env['MONGO_PORT']||27017,
    //user:process.env['MONGO_USER']||"root",
    //pass:process.env['MONGO_PWD']||"",
    db:"sbt_smth"
})))
*/
app.use(convert(serve(__dirname)))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(809)