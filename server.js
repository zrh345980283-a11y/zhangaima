const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 8000
const rootDir = path.join(__dirname, '细胞里的靖边数字博物馆')
app.use(express.static(rootDir))
app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')))
app.listen(port, '0.0.0.0')
