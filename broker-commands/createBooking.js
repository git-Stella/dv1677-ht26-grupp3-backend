import { ObjectId } from 'mongodb'
import { getClient } from '../db/database.mjs'
import { broker, BrokerError } from '../config/broker.js'

export async function createBooking(req, res) {
  const { resourceId, startsAt, endsAt, want } = req.body;
  const client = await getClient();
  const db = client.db(process.env.DATABASE_NAME);

  const resource = await db.collection('resources').findOne({ _id: new ObjectId(resourceId) });
  if (!resource) return res.status(404).json({ error: 'Resource not found' });

  const bookingId = new ObjectId();
  // const user = String(req.user._id);
  const user = String(req.body.user); // Instruktionerna säger fri text?
  const payload = resource.provider === 'maas'
    ? { systemId: resource.externalId, user, startsAt, endsAt, idempotencyKey: String(bookingId) }
    : { want, user, startsAt, endsAt, idempotencyKey: String(bookingId) };

  try {
    const { allocation } = await broker.allocate(resource.provider, payload);

    const booking = {
      _id: bookingId, resourceId: resource._id, bookedBy: req.user._id,
      startsAt: new Date(startsAt), endsAt: new Date(endsAt), status: 'confirmed',
    };
    await db.collection('bookings').insertOne({
      ...booking,
      broker: { allocationId: allocation.id, secret: allocation.secret },
    });
    return res.status(201).json(booking);   // secret finns bara i databasen, aldrig i svaret
  } catch (err) {
    if (!(err instanceof BrokerError)) throw err;
    if (err.status === 409) return res.status(409).json({ error: 'Booking denied', code: err.code });
    return res.status(503).json({ error: 'Booking service unavailable', code: err.code });
  };
};
