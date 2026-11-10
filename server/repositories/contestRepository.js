import {getDB} from '../config/db.js';
import {ObjectId} from 'mongodb';
export async function createContest(constestData){
    const collection = await getDB().collection('contests');
    const result = await collection.insertOne(constestData);

    return {
        _id :result.insertedId,
        ...constestData
    };

}


export async function getAllContests(){
    const collection = await getDB().collection('contests');
    return await collection.find({}).toArray();
}

export async function getContestById(id){
    return await getDB().collection('contests').findOne({_id: new ObjectId(id)});
}