import Router from 'koa-router'
import request from 'co-request'
import parse from 'co-body'

const router=new Router()

const proxyHost="http://iot.shibeta.org:806"

router.get('/',async ctx=>{
    var res=await request({uri:proxyHost+ctx.path+"?"+ctx.querystring,method:'GET'})
    ctx.body=res.body
})

router.post('/signup',async (ctx,next)=>{
    var res=await request({uri:proxyHost+ctx.path+"?"+ctx.querystring,
        method:"POST",body:JSON.stringify(await parse.json(ctx))})
    res.body=JSON.parse(res.body)
    if(res.body.result==200){
        var res2=await request({uri:proxyHost+"/user/oauth?uin="+res.body.uin+"&token="+res.body.token,
            method:"POST"})
        res2.body=JSON.parse(res2.body)
        if(res2.body.result==200)
            ctx.body=res.body
    }else
        ctx.body=res
    await next()
})

router.post('/login',async (ctx,next)=>{
    var res=await fetch(proxyHost+ctx.path+"?"+ctx.querystring,
        {method:"POST",body:JSON.stringify(await parse.json(ctx))})
    ctx.body=res.body
    await next();
})

export {router}