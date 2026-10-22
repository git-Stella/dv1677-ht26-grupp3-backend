import resources from "./resources.mjs";
import bookings from "./bookings.mjs";
import express from 'express';
import { notifyUpdate, notifyTest, notifyDiscord } from './methods/notify.js';
//import { ObjectId } from 'mongodb';
//import { connectDB } from './database.js';

const router = express.Router();

// --- Resurser ---

router.get('/', async (req, res) => {
    //return res.render("index", { resources: await resources.getAll() });
    //const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json({resources: await resources.getAll()});
});

/*router.post('/bookings', async (req, res) => {
  const db = await connectDB();
  const result = await db.collection('bookings').insertOne(req.body);

  // Skicka till alla som tittar på den här resursen
  req.io.to(`resource:${req.body.resource_id}`).emit('booking:created', {
    _id: result.insertedId,
    ...req.body
  });

  res.status(201).json({ _id: result.insertedId });
});*/
//req.io?.to(rum).emit('booking:created', data);

router.get('/info', async (req, res) => {
    const introduction = {devs: ["Andi Dupa", "Stella Karlsson"], course: "dv1677", group: 3, term: "ht26"}
    return res.json(introduction)
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

router.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    return res.json({result: result});
    //return res.redirect('/api');
});

router.put('/resources', async (req, res) => {
    const result = await resources.updateOne(req.body);
    return res.json({result: result});
});

// --- Bokningar ---

router.post('/bookings', async (req, res) => {
    const data = await bookings.addOne(req.body);
    //return res.redirect(`/resources/${req.body.resource_id}`);
    req.io?.to(`resource:${data.resource_id}`).emit('booking:created', {
        _id: result.insertedId,
        ...data
    })
    /*try {
        await notifyDiscord(`Ny bokning: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }*/
    notifyUpdate(data);
    return res.json({result: data});
});

//In frontend this receives it:
/*
socket.on('booking:created', (b) => {
  setBokningar(prev => [...prev, b])
})
  */

router.get('/bookings/:id', async (req, res) => {
    const result = await bookings.getByResource(req.params.id);
    return res.json(result);
})

router.delete('/bookings/:id', async (req, res) => {
    const data = await bookings.deleteOne(req.params.id);
    /*try {
        await notifyDiscord(`Bokning avslutad: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }*/
    notifyUpdate(data);
    return res.json(data);
});

router.put('/bookings', async (req, res) => {
    const data = await bookings.updateOne(req.body);
    /*try {
        await notifyDiscord(`Bokning uppdaterad: ${data.resource_id}`)
    }
    catch (error) {
        console.error('Notifiering misslyckades:', error.message)
    }*/
    notifyUpdate(data);
    return res.json({result: data});
});

router.get('/test/message/:message', async (req, res) => {
    const message = req.params.message;
    req.io?.to(`test`).emit('test:performed', `${message}`/*{
        message: message
    }*/)
    return res.json({message: message});
})

router.get('/test/notify', async (req, res) => {
    await notifyTest(`worf`)
    return res.json({test: "tested"})
})

/*
// Skicka till alla i rummet INKLUSIVE avsändaren
io.to(`doc:${dokumentId}`).emit('uppdatering', data)
*/

export default router;