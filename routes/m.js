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

router.get('/getdata',async ctx=>{
    var res=await ctx.redis.hgetall(ctx.query.uin)
    if(res)
        ctx.body=res
    else
        ctx.body={result:404}
    await next();
})

export {router}