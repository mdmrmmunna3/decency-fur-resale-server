const express = require('express');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middelwares 
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Decency Fur ReSale is running');
});

app.listen(port, () => {
    console.log(`Decency Fur ReSale is running on ${port}`)
})