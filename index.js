const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middelwares 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.le2w9sh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const categoriesCollection = client.db('decencyFurReSale').collection('categories');
        const productsCollection = client.db('decencyFurReSale').collection('products');
        const bookCollection = client.db('decencyFurReSale').collection('orders');
        const allUsersCollection = client.db('decencyFurReSale').collection('allusers')


        // veryfy admin 
        // const verifyAdmin = async (req, res, next) => {
        //     const decodedEmail = req.decoded.email
        //     const query = { email: decodedEmail }
        //     const user = await allUsersCollection.findOne(query);
        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' });
        //     }
        //     next();
        // }

        // get categories form database
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            // console.log(categories);
            res.send(categories)
        });

        // add product 
        app.post('/products', async (req, res) => {
            const addProduct = req.body;
            const result = await productsCollection.insertOne(addProduct);
            res.send(result);
        })

        // get product 
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        // get product by id 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query)
            res.send(product);
        })


        // add book order 
        app.post('/bookingOrders', async (req, res) => {
            const bookedProduct = req.body;
            const result = await bookCollection.insertOne(bookedProduct);
            res.send(result);
        })

        // get booking order 
        app.get('/bookingOrders', async (req, res) => {
            const query = {};
            const products = await bookCollection.find(query).toArray();
            res.send(products);
        })


        // alluser part
        // saved user data with email and paswword
        app.post('/allusers', async (req, res) => {
            const user = req.body;
            const result = await allUsersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/allusers', async (req, res) => {
            const query = {};
            const users = await allUsersCollection.find(query).toArray();
            res.send(users);
        })

        app.get('/allusers/userInfo', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await allUsersCollection.findOne(query);
            res.send(user);
            
        })

        app.put('/allusers/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await allUsersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/allusers/:id' , async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allUsersCollection.deleteOne(query);
            res.send(result);
        })

    }


    finally {

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Decency Fur ReSale is running');
});

app.listen(port, () => {
    console.log(`Decency Fur ReSale is running on ${port}`)
})