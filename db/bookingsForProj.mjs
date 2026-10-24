import { db } from './database.mjs';
import { BSON } from 'mongodb';

const dbNameBookings = process.env.COLLECTION_NAME_BOOKINGS_PROJ || "bookings";

const bookingsForProj = {
    getAll: async function getAll() {
        const res = await db.collection(dbNameBookings).find({}).toArray();

        return res;
    },
    getByResource: async function getByResource(resourceId) {
        const res = await db.collection(dbNameBookings).find({ resource_id: parseInt(resourceId, 10) }).sort({ start_time: -1 }).toArray();

        return res;
    },
    getUserBookings: async function getUserBookings(user) {
        const today = new Date();
        const res = await db.collection(dbNameBookings).find({ bookedBy: user }).sort({ start_time: -1 }).toArray();
        const result = res.filter((booking) => new Date(booking.endsAt) > today && booking.status == "confirmed");

        return result;
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
    deleteOne: async function deleteOne(id) {
        const nid = new BSON.ObjectId(id);
        const res = await db.collection(dbNameBookings).deleteOne({ _id: nid });

        return { changes: res.deletedCount };
    }
};

export default bookingsForProj;
