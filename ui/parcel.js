const proxy = require('http-proxy-middleware')
const Bundler = require('parcel-bundler')
const express = require('express')

const app = express()
const bundler = new Bundler('src/index.html', {
  outDir: './build/',
})

app.use(
  proxy('/chronograf/v1', {
    target: 'http://localhost:8888',
    logLevel: 'warn',
    changeOrigin: true,
  })
)

app.use(bundler.middleware())
app.listen(Number(process.env.PORT || 1234))
