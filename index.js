const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5dxls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run(){
    try {
        await client.connect();
        const database = client.db("fantasy-rides");
        const rideCollection = database.collection("rides");
        const bookingCollection = database.collection("booking");
        
        // get api
        app.get('/rides',async(req,res)=>{
            const curson = rideCollection.find({});
            const rides = await curson.toArray();
            res.send(rides);
        });

        // get single ride api
        app.get('/ride/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const ride = await rideCollection.findOne(query);
            console.log('load ride with id:',id);
            res.send(ride);
          })

        //rides post api
        app.post('/rides', async(req,res)=>{
            const newRide = req.body;
            const result = await rideCollection.insertOne(newRide);
            console.log('Got New Ride',req.body);
            console.log('Added Ride', result);
            res.json(result);
        });

         //booking get api
         app.get('/booking', async(req,res)=>{
            const curson = bookingCollection.find({});
            const bookings = await curson.toArray();
            res.send(bookings);
        });

        //booking post api
        app.post('/booking', async(req,res)=>{
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            console.log('Got New Ride',req.body);
            console.log('Added Ride', result);
            res.json(result);
        });
        
        //delete booking
        app.delete('/booking/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            console.log('deleting booking with id',result);
            res.json(result);          
        })
        //update api
      app.put('/booking/:id',async(req,res)=>{
        const id = req.params.id;
        const updatedBooking = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
          $set:{
            status: updatedBooking.status,
          },
        };
        const result = await bookingCollection.updateOne(filter, updateDoc, options);
        console.log('updating booking', id);
        res.send(result)
      })
  
  
      } finally {
      //   await client.close();
      }
    }
    run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Server is running!");
})

app.listen(port,()=>{
    console.log("Server is hitting!!");
})