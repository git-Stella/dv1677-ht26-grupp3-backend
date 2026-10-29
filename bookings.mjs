import { db } from './db/database.mjs';
import { BSON } from 'mongodb';

const dbNameBookings = process.env.COLLECTION_NAME_BOOKINGS || "booking_project_collection_bookings";

const bookings = {
    getAll: async function getAll() {
        const res = await db.collection(dbNameBookings).find({}).toArray();

        return res;
    },
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
    
        db.collection(dbNameBookings).insertOne(newItem);

        const res = await db.collection(dbNameBookings).find().sort({_id:-1});

        return res;
    },
    deleteOne: async function deleteOne(id, userId) {
        const nid = new BSON.ObjectId(id);
        const res = await db.collection(dbNameResources).deleteOne({ _id: nid, user: userId });

        return { changes: res.deletedCount };
    },
    updateOne: async function updateOne(body) {
        const filter = { _id: body._id, user: body.user };
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
