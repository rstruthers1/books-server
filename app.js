const express = require('express');
require('dotenv').config()
const app = express();
const bookRouter = require('./routes/books')
const albumRouter = require('./routes/albums')

const cors = require("cors");



app.use(express.json());
app.use(cors());


app.use('/', bookRouter);
app.use('/', albumRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send(err)
})

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`)
});
