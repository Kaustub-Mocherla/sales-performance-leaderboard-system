import {getDB} from '../config/db.js';
import { ObjectId } from 'mongodb';

export async function createEmployee(employeeData){
    const db = await getDB();

    const result = await db.collection("employees").insertOne(employeeData);

    return {
        _id : result.insertedId,
        ...employeeData
    };
}

export async function getAllEmployees(){
    const db = await getDB();

    return await db.collection("employees").find({}).toArray();
}

export async function getEmployeeById(id){
    return await getDB().collection("employees").findOne({_id : new ObjectId(id)});
}
