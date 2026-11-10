import {MongoClient} from 'mongodb';
import "dotenv/config";
const uri = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME;

if (!uri || !dbName){
  throw new Error("MongoDB configuration is missing.");

}

const client = new MongoClient(uri);

let db;



export async function connectDB(){
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });

  db = client.db(dbName);
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  return db;
} 

export function getDB() {
  if(!db){
    throw new Error("Database not connected.");
  }
  return db;
}


export async function closeDB(){
  await client.close();
  db = undefined; 
}





