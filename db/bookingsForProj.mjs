import { db } from './database.mjs';
import { BSON } from 'mongodb';

const dbNameBookings = process.env.COLLECTION_NAME_BOOKINGS_PROJ || "bookings";

const bookingsForProj = {
    getAll: async function getAll() {
        const res = await db.collection(dbNameBookings).find({}, { projection: { "broker.secret": 0 } }).toArray();

        return res;
    },
    getByResource: async function getByResource(resourceId) {
        const res = await db.collection(dbNameBookings).find({ resource_id: parseInt(resourceId, 10) }, { projection: { "broker.secret": 0 } }).sort({ start_time: -1 }).toArray();

        return res;
    },
    getUserBookings: async function getUserBookings(user) {
        const today = new Date();
        console.log("User parameter:", JSON.stringify(user));
        const res = await db.collection(dbNameBookings).find({ bookedBy: user }, { projection: { "broker.secret": 0 } }).sort({ start_time: -1 }).toArray();
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
    
        const result = await db.collection(dbNameBookings).insertOne(newItem);

        const booking = await db.collection(dbNameBookings).find({ _id: result.insertedId }, { projection: { "broker.secret": 0 } });

        return booking;
    },
    deleteOne: async function deleteOne(id) {
        const nid = new BSON.ObjectId(id);
        const res = await db.collection(dbNameBookings).deleteOne({ _id: nid });

        return { changes: res.deletedCount };
    }
};

export default bookingsForProj;
