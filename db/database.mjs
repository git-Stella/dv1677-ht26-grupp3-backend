import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./db')) {
    mkdirSync('./db');
}

dotenv.config();

let client = null;
// const client = new MongoClient(process.env.MONGODB_URI);
const dbNameBookings = process.env.COLLECTION_NAME_BOOKINGS;
const dbNameResources = process.env.COLLECTION_NAME_RESOURCES;
const dbName = process.env.DATABASE_NAME;
let db;

async function getClient() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
    }
    return client;
}

async function connectDB() {
  const c = await getClient();
  return c.db(process.env.DATABASE_NAME);
};

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
  }
};

async function testDatabase() {
    try {
        //console.log(client)
        //console.log("connect")
        // await client.connect();
        const newClient = await getClient();
        //console.log("name")
        db = newClient.db(dbName);
        //console.log(db);
        const resourcesItems = await db.collection(dbNameResources).find({}).toArray();
        const bookingsItems = await db.collection(dbNameBookings).find({}).toArray();

        if (resourcesItems.length == 0) {
            let bulk = db.collection(dbNameResources).initializeOrderedBulkOp();
            bulk.insert( {name: "VM-01", type: "vm", description: "Ubuntu 24.04 – 4 vCPU, 8 GB RAM", capacity: 1} );
            bulk.insert( {name: "VM-02", type: "vm", description: "Debian 12 – 2 vCPU, 4 GB RAM", capacity: 1} );
            bulk.insert( {name: "GPU-server-1", type: "gpu", description: "NVIDIA T4 – för ML-arbetsbelastningar", capacity: 1} );
            bulk.execute();
        }

        if (bookingsItems.length == 0) {
            let bulk = db.collection(dbNameBookings).initializeOrderedBulkOp();
            bulk.insert( {resource_id: 1, user: "anna@student.bth.se", start_time: "2026-09-15 08:00", end_time: "2026-09-15 12:00", status: "confirmed"} );
            bulk.insert( {resource_id: 2, user: "erik@student.bth.se", start_time: "2026-09-15 13:00", end_time: "2026-09-15 17:00", status: "confirmed"} );
            bulk.execute();
        }
    } catch (e) {
        console.error("Error occured: ", e);
        process.exit(1);
    }
}

export { testDatabase, db, getClient, closeDB, connectDB };
