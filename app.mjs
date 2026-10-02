import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDatabase, db } from './db/database.mjs';
import bookings from "./bookings.mjs";
import routes from "./routes.js";
import resources from "./resources.mjs";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);

await testDatabase();

const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    //return res.render("index", { resources: await resources.getAll() });
    //const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json({resources: "They are not here"});
});

// --- Resurser ---

/*app.get('/', async (req, res) => {
    //return res.render("index", { resources: await resources.getAll() });
    //const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json({resources: await resources.getAll()});
});

app.get('/info', async (req, res) => {
    const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json(introduction)
});

app.get('/deprecated', async (req, res) => {
    return res.render("index", { resources: await resources.getAll() });
});

app.get('/deprecated/resources/new', async (req, res) => {
    return res.render("resource-form", { resource: {} });
});

app.post('/resources', async (req, res) => {
    await resources.addOne(req.body);
    return res.redirect('/');
});

app.get('/resources/:id', async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    const resourceBookings = await bookings.getByResource(req.params.id);
    return res.json({bookings: resourceBookings, resources: resource})
    //return res.render("resource", { resource, bookings: resourceBookings });
});

app.get('/deprecated/resources/:id/edit', async (req, res) => {
    return res.render("resource-form", {
        resource: await resources.getOne(req.params.id)
    });
});

app.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    res.json(result);
});

// --- Bokningar ---

app.post('/bookings', async (req, res) => {
    await bookings.addOne(req.body);
    res.redirect(`/resources/${req.body.resource_id}`);
});

app.delete('/bookings/:id', async (req, res) => {
    const result = await bookings.deleteOne(req.params.id);
    return res.json(result);
});*/

/*app.listen(port, () => {
    console.log(`Proxmox Booking app listening on port ${port}`);
});*/

export default app;
