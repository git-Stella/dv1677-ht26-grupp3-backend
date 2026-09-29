import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDatabase, db } from './db/database.mjs';
import bookings from "./bookings.mjs";
import resources from "./resources.mjs";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Route 1 - get all resources

app.get('/', async (req, res) => {
    return res.json({resources: await resources.getAll()});
});

// Route 2 - add new resource to resources collection

// Behöver formulär?
// app.get('/resources/new', async (req, res) => {
//     // return res.render("resource-form", { resource: {} });
//     db.collection(dbNameBookings).find({}).toArray();
//     return res.redirect('/');
// });

app.post('/resources', async (req, res) => {
    await resources.addOne(req.body);
    return res.redirect('/');
});

// Route 3 - look for resource and booking matching resourse_id

app.get('/api/resources/:id', async (req, res) => {
    try {
        const resource = await resources.getOne(req.params.id);
        const resourceBookings = await bookings.getByResource(req.params.id);
        res.json({"resource": { resource, bookings: resourceBookings }});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route 4 - change an existing document

// Behöver formulär?
// app.get('/resources/:id/edit', async (req, res) => {
//     return res.render("resource-form", {
//         resource: await resources.getOne(req.params.id)
//     });
// });

// Route 5 - delete an existing resource document

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
    res.json(result);
});

testDatabase();

app.listen(port, () => {
    console.log(`The server is running on: localhost:${port}`);
});
