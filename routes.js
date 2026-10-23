import resources from "./resources.mjs";
import bookings from "./bookings.mjs";
import express from 'express';
import { broker } from "./config/broker.js";
import { syncResources } from "./db/syncResources.js";
import { createBooking } from "./broker-commands/createBooking.js";
import { cancelBooking } from "./broker-commands/cancelBooking.js";
import { ledigaTider } from "./domain/availability.js";
import { test } from "vitest";
//import { ObjectId } from 'mongodb';
//import { connectDB } from './database.js';

const router = express.Router();

// --- Resurser ---

router.get('/', async (req, res) => {
    //return res.render("index", { resources: await resources.getAll() });
    //const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json({resources: await resources.getAll()});
});

router.get('/info', async (req, res) => {
    const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json(introduction)
});

router.get('/deprecated', async (req, res) => {
    return res.render("index", { resources: await resources.getAll() });
});

router.get('/deprecated/resources/new', async (req, res) => {
    return res.render("resource-form", { resource: {} });
});

router.post('/resources', async (req, res) => {
    const result = await resources.addOne(req.body);
    return res.json({result: result});
    //return res.redirect('/api');
});

router.get('/resources/:id', async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    const resourceBookings = await bookings.getByResource(req.params.id);
    return res.json({bookings: resourceBookings, resources: resource})
    //return res.render("resource", { resource, bookings: resourceBookings });
});

router.get('/deprecated/resources/:id/edit', async (req, res) => {
    return res.render("resource-form", {
        resource: await resources.getOne(req.params.id)
    });
});

router.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    return res.json({result: result});
    //return res.redirect('/api');
});

// --- Bokningar ---

router.post('/bookings', async (req, res) => {
    await bookings.addOne(req.body);
    return res.redirect(`/resources/${req.body.resource_id}`);
});

router.delete('/bookings/:id', async (req, res) => {
    const result = await bookings.deleteOne(req.params.id);
    return res.json(result);
});

router.get('/test/broker/who', async (req, res) => {
    // Testing

    const BASE = process.env.BROKER_API_URL;

    const headers = {
        'X-Booker-Group': process.env.BROKER_GROUP_TOKEN,
        'Content-Type': 'application/json',
    };

    const result = await fetch(`${BASE}/whoami`, { headers });

    const testing = await result.json();

    console.log(testing);

    return res.json(testing);
});

router.get('/test/broker/inventory/:id', async (req, res) => {
    // Testing

    const testResult = await broker.inventory(req.params.id);
    console.log("testResult: ", testResult);

    return res.json(testResult);
});

router.get('/test/broker/sync', async (req, res) => {
    // Testing

    await syncResources();

    return;
});

router.post('/test/broker/book', async (req, res, next) => {
    try {
        console.log(req.body);

        await syncResources();

        const result = await createBooking(req, res);
        return result;
    } catch (e) {
        next(e);
    }
});

// router.post('/test/broker/cancel/:id', async (req, res, next) => {
//     // Testing

//     try {
//         console.log(req.params.id);

//         await syncResources();

//         const result = await cancelBooking(req, res);
//         return result;
//     } catch (e) {
//         next(e);
//     }
// });

router.post('/test/broker/cancel', async (req, res, next) => {
    // Testing

    try {
        console.log(req.body);

        await syncResources();

        const result = await cancelBooking(req, res);
        return result;
    } catch (e) {
        next(e);
    }
});

router.get('/test/broker/availability', async (req, res) => {
    // Testing

    await syncResources();

    const bookingsList = await bookings.getAll();

    const start = new Date();
    start.setUTCHours(0,0,0,0);

    const end = new Date();
    end.setUTCHours(23,59,59,999);

    const available = await ledigaTider(bookingsList, start, end);
    console.log("Test availability: ", "bookings: ", bookingsList, "start: ", start, "end: ", end, "available: ", available);

    return res.json(available);
});

export default router;