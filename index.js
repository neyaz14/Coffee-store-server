const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epj76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffeeCollection");


    const userCollection = database.collection('userCollection');


    // step1:  client side theke paoa form er data gula recieve korar code 
    // to recieve --> post 
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee);

      res.send(result);
    })

    // to get all data from db --> 
    // data read , find();

    app.get('/coffee', async (req, res) => {
      // find e kono query dibo na , condition dibo na.
      const coursor = coffeeCollection.find();
      // array banate hobe-->
      const result = await coursor.toArray();
      res.send(result);
    })


    // delete data : 
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // update route e read kora hoccee : 
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })
    // to send updated data in db : 
    // PUT
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = { upsert: true };
      const updatedCoffee = req.body;
      const UpdatedCoffee = {
        $set: {
          name: updatedCoffee.name, chef: updatedCoffee.chef, supplier: updatedCoffee.supplier, taste: updatedCoffee.taste, category: updatedCoffee.category, details: updatedCoffee.details, photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(query, UpdatedCoffee, options);
      res.send(result);
    })



    // to get data
    app.get('/users', async (req, res) => {
      const coursor = userCollection.find();
      const result = await coursor.toArray();
      res.send(result);
    })
    // userLogin Info

    app.post('/users', async (req, res) => {
      const newuser = req.body;
      console.log(newuser);
      const result = await userCollection.insertOne(newuser);
      res.send(result);
    })

    // delete 

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })


// login e user ke dhorar jonno
    app.patch('/users', async(req, res)=>{
      // filter / query
      const email = req.body.email;
      const filter ={email};
      const updatedDoc = {
        $set:{
          lastSignInTime: req.body?.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result)
    } )










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Coffee making server is running")
})


app.listen(port, () => {
  console.log(`coffee server is running on :${port} port`)
})