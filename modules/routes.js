import '../modules/styles.css'
import React from 'react'
import { Route } from 'react-router'
import App from './components/App'
import Post from './components/Post'

export default (
  <Route>
    <Route path="/" component={App} />
    <Route path="/posts/:postId" component={Post} />
    <Route path="*" component={App} />
  </Route>
)
