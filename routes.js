import resources from "./resources.mjs";
import bookings from "./bookings.mjs";
import express from 'express';
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
    await resources.addOne(req.body);
    return res.redirect('/');
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
    return res.json(result);
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

export default router;