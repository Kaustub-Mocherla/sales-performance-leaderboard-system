import {MongoClient} from 'mongodb';

const uri = process.env.ATLAS_URI || "";

const client = new MongoClient(uri);

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err) {
  console.error(err);
}

let db = client.db("sales");

export default db;
