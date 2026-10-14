import { db } from './db/database.mjs';
import { BSON } from 'mongodb';

const dbNameResources = process.env.COLLECTION_NAME_BOOKINGS || "booking_project_collection_bookings";

const bookings = {
    getByResource: async function getByResource(resourceId) {
        const res = await db.collection(dbNameResources).find({ resource_id: parseInt(resourceId, 10) }).sort({ start_time: -1 }).toArray();

        return res;
    },
    addOne: async function addOne(body) {
        const newItem = {
            resource_id: body.resource_id,
            user: body.user, start_time:
            body.start_time, end_time:
            body.end_time,
            status: "confirmed"
        };
    
        db.collection(dbNameResources).insertOne(newItem);

        const res = await db.collection(dbNameResources).find().sort({_id:-1});

        return res;
    },
    deleteOne: async function deleteOne(id) {
        const nid = new BSON.ObjectId(id);
        const res = await db.collection(dbNameResources).deleteOne({ _id: nid });

        return { changes: res.deletedCount };
    },
    updateOne: async function updateOne(body) {
        const filter = { _id: body._id };
        const updateBooking = {
            $set: {
                resource_id: body.resource_id,
                user: body.user, start_time:
                body.start_time, end_time:
                body.end_time,
                status: body.status
            },
        };
        const res = await db.collection(dbNameResources).updateOne(filter, updateBooking)
        return res;
    }
};

export default bookings;
