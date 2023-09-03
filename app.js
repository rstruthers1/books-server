var express = require('express');
var app = express();
const bookRouter = require('./routes/books')
const cors = require("cors");


app.use(express.json());
app.use(cors());


app.use('/', bookRouter);
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`)
});
