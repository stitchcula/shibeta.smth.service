/**
 * Created by stitchcula on 2016/4/16.
 */

import Router from 'koa-router'

const router=new Router()

router.get('/',async (ctx,next)=>{
    ctx.redirect('/static/org.shibeta.smth.apk')
    next()
})

export {router}
