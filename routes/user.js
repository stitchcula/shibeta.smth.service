import Router from 'koa-router'
import fetch from 'node-fetch'
import parse from 'co-body'

const router=new Router()

const proxyHost="http://iot.shibeta.org:806"

router.get('/',async ctx=>{
    var res=await fetch(proxyHost+ctx.path+"?"+ctx.querystring)
    ctx.body=await res.json();
})

router.post('/signup',async (ctx,next)=>{
    var res=await fetch(proxyHost+ctx.path+"?"+ctx.querystring,
        {method:"POST",body:await parse.json(ctx)})
    res=await res.json()
    if(res.result==200){
        res2=await fetch(proxyHost+ctx.path+"?uin="+res.uin+"&token="+res.token,
            {method:"POST"})
        res2=await res2.json()
        if(res2.result==200)
            this.body=res
    }else
        ctx.body=res
    await next()
})

router.post('/login',async (ctx,next)=>{
    var res=await fetch(proxyHost+ctx.path+"?"+ctx.querystring,
        {method:"POST",body:await parse.json(ctx)})
    ctx.body=await res.json()
    await next();
})

export {router}