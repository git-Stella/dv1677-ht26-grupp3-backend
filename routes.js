import resources from "./resources.mjs";
import bookings from "./bookings.mjs";
import users from "./users.mjs";
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notifyUpdate, notifyTest, notifyDiscord, notifyBook, notifyDelete } from './methods/notify.js';
import requireAuth from './middleware/auth.js';
import bookingsForProj from "./db/bookingsForProj.mjs";
import resourcesForProj from "./db/resourcesForProj.mjs";
import { broker } from "./config/broker.js";
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
});


// RESOURCES + BOOKINGS FOR PROJ
router.get('/resources/all', async (req, res) => {
    const resources = await resourcesForProj.getAll();
    return res.json(resources);
});

router.get('/booking/:user', requireAuth, async (req, res) => {
    const userBooking = await bookingsForProj.getUserBookings(req.params.user);
    return res.json(userBooking);
});
//

router.get('/resources/:id', requireAuth, async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    const resourceBookings = await bookings.getByResource(req.params.id);
    return res.json({bookings: resourceBookings, resources: resource})
});

router.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    return res.json({result: result});
});

router.put('/resources', async (req, res) => {
    const result = await resources.updateOne(req.body);
    return res.json({result: result});
});

// --- Bokningar ---

router.post('/bookings', requireAuth, async (req, res) => {
    const data = await bookings.addOne(req.body);
    //return res.redirect(`/resources/${req.body.resource_id}`);
    req.io?.to(`resource:${data.resource_id}`).emit('booking:created', {
        _id: result.insertedId,
        ...data
    })

    notifyBook(req.body);
    return res.json({result: data});
});

//In frontend this receives it:
/*
socket.on('booking:created', (b) => {
  setBokningar(prev => [...prev, b])
})
  */

router.get('/bookings/:id', requireAuth, async (req, res) => {
    const result = await bookings.getByResource(req.params.id);
    return res.json(result);
})

router.delete('/bookings/:id', requireAuth, async (req, res) => {
    const data = await bookings.deleteOne(req.params.id, req.body.user);

    notifyDelete(req.body);
    return res.json(data);
});

router.put('/bookings', requireAuth, async (req, res) => {
    const data = await bookings.updateOne(req.body);

    notifyUpdate(req.body);
    return res.json({result: data});
});

router.get('/test/message/:message', async (req, res) => {
    const message = req.params.message;
    req.io?.to(`test`).emit('test:performed', `${message}`/*{
        message: message
    }*/)
    return res.json({message: message});
})

router.get('/test/notify', requireAuth, async (req, res) => {
    await notifyTest(`worf`)
    return res.json({test: "tested"})
})

router.post('/auth/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)
    const data = {
        hash: hash,
        mail: req.body.mail
    }
    const exists = await users.getOneByMail(req.body.mail)
    if (exists.length != 0) {
        return res.json({status: "unable to create"})
    }
    const user = await users.addOne(data)
    return res.json({status: "created"})
})

router.post('/auth/login', async (req, res) => {
    let user = await users.getOneByMail(req.body.mail)
    if (!user[0]) {
        user = [{hash: "F"}]
    }

    const ok = user && await bcrypt.compare(req.body.password, user[0].hash)
    if (!ok) {
        return res.status(401).json({ error: 'Incorrect mail or password' })
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    )
    res.json({token: token, user: user[0]._id})
})

/*
// Skicka till alla i rummet INKLUSIVE avsändaren
io.to(`doc:${dokumentId}`).emit('uppdatering', data)
*/
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
    const testResult = await broker.inventory(req.params.id);
    console.log("testResult: ", testResult);

    return res.json(testResult);
});

router.post('/test/broker/book', requireAuth, async (req, res, next) => {
    try {
        const result = await createBooking(req, res);
        notifyBook(req.body)
        return result;
    } catch (e) {
        next(e);
    }
});

// router.post('/test/broker/cancel', requireAuth, async (req, res, next) => {
//     try {
//         const result = await cancelBooking(req, res);
//         const booking = await bookingsForProj.getBySecret(req.body.secret);
//         notifyDelete(booking[0]);
//         return result;
//     } catch (e) {
//         next(e);
//     }
// });

router.post('/test/broker/cancel', requireAuth, async (req, res, next) => {
    try {
        const newBooking = await bookingsForProj.getBookingById(req.body.secret);
        const result = await cancelBooking(newBooking[0].broker.secret, req.body.user, res);
        notifyDelete(newBooking[0]._id);
        return result;
    } catch (e) {
        next(e);
    }
});

router.get('/test/broker/availability', async (req, res) => {
    const bookingsList = await bookingsForProj.getAll();

    const start = new Date();
    start.setUTCHours(0,0,0,0);
    const end = new Date();
    end.setUTCHours(23,59,59,999);

    const available = await ledigaTider(bookingsList, start, end);

    return res.json(available);
});

router.get('/test/broker/user/:user', async (req, res) => {
    const user = req.params.user;

    const result = await bookingsForProj.getUserBookings(user);

    return res.json(result);
});

export default router;