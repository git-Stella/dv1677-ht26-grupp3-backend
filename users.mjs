import { db } from './db/database.mjs';
import { BSON } from 'mongodb';

const dbNameResources = process.env.COLLECTION_NAME_USERS || "booking_project_collection_users";

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
    getOneByMail: async function getOneByMail(mail) {
        const res = await db.collection(dbNameResources).find({ mail: mail }).toArray();
        return res;
    },
    addOne: async function addOne(body) {
        //console.log(body)
        const newItem = {
            hash: body.hash,
            mail: body.mail
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
    },
    updateOne: async function updateOne(body) {
        const filter = { _id: body._id };
        const updateResource = {
            $set: {
                hash: body.hash,
                mail: body.mail
            },
        };
        const res = await db.collection(dbNameResources).updateOne(filter, updateResource)
        return res;
    }
};

export default resources;
