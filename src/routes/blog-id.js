import { Router } from 'express'
import { renderToString } from 'react-dom/server'
import React from 'react'
import JwtDecrypt from '../middleware/jwt-decrypt'
import BlogId from '../components/pages/blog-id/blog-id'
import BlogClient from '@c4-smoketrees/blog-client'
import BlogEdit from '../components/pages/blog-edit/blog-edit'

const router = Router()

router.get('/:blogId', JwtDecrypt(true), async (req, res) => {
  const blogId = req.params.blogId
  if (blogId.length !== 24) {
    res.redirect(`${process.env.BLOG_FRONTEND_URL}/error`)
    return
  }
  let blog
  try {
    const response = await BlogClient.getOneBlog(req.params.blogId, req.jwt)
    blog = response.blog
  } catch (e) {
    res.redirect(`${process.env.BLOG_FRONTEND_URL}/error`)
    return
  }
  const reactComp = renderToString(<BlogId user={req.user} blog={blog} />)
  res.status(200).render('pages/blog-id', {
    reactApp: reactComp,
    url: req.app.locals.url,
    user: req.user,
    blog: blog
  })
})

router.get('/:blogId/edit', JwtDecrypt(true), async (req, res) => {
  let blog
  try {
    const response = await BlogClient.getOneBlog(req.params.blogId, req.jwt)
    blog = response.blog

    if (blog.author !== req.user._id) {
      res.redirect(`${process.env.BLOG_FRONTEND_URL}/error`)
      return
    }
  } catch (e) {
    res.redirect(`${process.env.BLOG_FRONTEND_URL}/error`)
    return
  }
  const reactComp = renderToString(<BlogEdit user={req.user} blog={blog} />)
  res.status(200).render('pages/blog-edit', {
    reactApp: reactComp,
    url: req.app.locals.url,
    user: req.user,
    blog: blog
  })
})

router.post('/:blogId/edit', JwtDecrypt(true), async (req, res) => {
  try {
    const response = await BlogClient.updateBlog(req.params.blogId, req.body, req.jwt)

    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({ status: false })
  }
})
module.exports = router
