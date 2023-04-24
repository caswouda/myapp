const express = require('express')
const app = express()
const port = 3000
const userRouter = require('./src/routes/user.routes')

app.use('*',(req, res, next) => {
    const method = req.method
    console.log(`Methode ${method} is aangeroepen`)
    next()
  })

  app.use(userRouter)

  app.use('*',(req, res) => {
    res.status(404).json(
        {
            status: 404,
            message: 'Endpoint not found',
            data: {}
        }
    )
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
