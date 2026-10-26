import { ObjectId } from "mongodb";
import { getClient } from "../db/database.mjs";
import { broker, BrokerError } from "../config/broker.js";

export async function cancelBooking(req, res) {
  const client = await getClient();
  const db = client.db(process.env.DATABASE_NAME);

  const booking = await db.collection('bookings').findOne({ "broker.secret": req.body.secret });
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const resource = await db.collection('resources').findOne({ _id: booking.resourceId });

  if (booking.broker?.secret) {
    try {
      await broker.withdraw(resource.provider, booking.broker.allocationId, booking.broker.secret)
    } catch (err) {
      if (!(err instanceof BrokerError)) throw err
      return res.status(503).json({ error: 'Could not cancel at provider', code: err.code })
    }
  }

  await db.collection('bookings').updateOne({ _id: booking._id }, { $set: { status: 'cancelled' } })
  res.json({ message: 'Booking cancelled' })
}
