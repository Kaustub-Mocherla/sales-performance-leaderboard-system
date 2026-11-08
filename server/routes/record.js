import db from '../db/connection.js';
import {ObjectId} from 'mongodb';
import express from 'express';

const router = express.Router();

//this gets all records from db
router.get('/',async (req,res) =>  {
    let collection = await db.collection('records');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

//this creates new record in db
router.post('/',async (req,res) =>{
    try{
        let newDoc = {
            firstName: req.body.firstName,
            lastName : req.body.lastName,
            middleName : req.body.middleName,

        }
        let collection = await db.collection('records');
        let results = await collection.insertOne(newDoc);
        res.status(201).json({
            _id: results.insertedId,
            ...newDoc
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding record');
    }
});

//this updates a record in db
router.patch('/:id', async (req,res) =>{
    try{
    if(!ObjectId.isValid(req.params.id)){
        return res.sendStatus(400).send("Invalid ID");
    }
    const query = {_id: new ObjectId(req.params.id)};
    const updates = {
        $set: {
            firstName : req.body.firstName,
            middleName : req.body.middleName,
            lastName : req.body.lastName,
        },
    };
    let collection = await db.collection('records');
    let results = await collection.updateOne(query,updates);
    res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating record');
    }
})

router.delete('/:id', async (req,res) =>{
    try{
        if(!ObjectId.isValid(req.params.id)){
            return res.sendStatus(400).send("Invalid ID");
        }

        const collection = db.collection('records');
        let results = await collection.deleteOne({_id: new ObjectId(req.params.id)});

        res.status(200).json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error deleting record');
    }
});

export default router;