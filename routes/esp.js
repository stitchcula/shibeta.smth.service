/**
 * Created by stitchcula on 16-4-11.
 */

import Router from 'koa-router'

const router=new Router()

router.get('/',async (ctx,next)=>{
    if(/^[0-9]{8}$/.test(ctx.query.uin))
        await next()
    else
        throw 403
})

router.get('/signin',async ctx=>{
    await ctx.redis.hmset(ctx.query.uin,{
        timestamp:new Date().getTime()
    })
    await ctx.redis.expire(ctx.query.uin,600)
    ctx.body="200"
    await next();
})

router.get('/updata',async ctx=>{
    if(ctx.query.data) {
        await ctx.redis.hmset(ctx.query.uin, {
            timestamp: new Date().getTime(),
            data: ctx.query.data.split(':')
        })
        await ctx.redis.expire(ctx.query.uin, 600)
        ctx.body = "200"
    }else 
        throw 403
    await next();
})

export {router}