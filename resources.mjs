import { db } from './db/database.mjs';
import { BSON } from 'mongodb';

const dbNameResources = process.env.COLLECTION_NAME_RESOURCES;

const resources = {
    getAll: async function getAll() {
        const res = await db.collection(dbNameResources).find({}).toArray();

        return res;
    },
    getOne: async function getOne(id) {
        const nid = new BSON.ObjectId(id);
        const res = await db.collection(dbNameResources).find(/*{ name: id }*/{ _id: nid }).toArray();

        return res;
    },
    addOne: async function addOne(body) {
        //console.log(body)
        const newItem = {
            name: body.name,
            type: body.type,
            description: body.description,
            capacity: Number(body.capacity) || 1
        };
    
        db.collection(dbNameResources).insertOne(newItem);

        const res = await db.collection(dbNameResources).find().sort({_id:-1}).toArray();

        return res;
    },
    deleteOne: async function deleteOne(id) {
        //const nid = new BSON.ObjectId(id);
        /*try {
            const nid = new BSON.ObjectId(id);
            const res = await db.collection(dbNameResources).deleteOne({ _id: nid });
            return res/*{ changes: res.deletedCount };
        }*/
        //const res = await db.collection(dbNameResources).deleteOne({ _id: nid }).toArray();
        const res = await db.collection(dbNameResources).deleteOne({ name: id });
        return { changes: res.deletedCount };
    }
};

export default resources;
