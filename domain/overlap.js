import { getClient } from "../db/database.mjs";

const client = await getClient();
const db = client.db(process.env.DATABASE_NAME);

// export function overlappar(a, b) {
//   return a.start < b.end && b.start < a.end
// }

// const krock = await db.collection('bookings').findOne({
//   resource_id: resursId,
//   start: { $lt: nySlut },
//   end:   { $gt: nyStart }
// })

// if (krock) {
//   return res.status(409).json({
//     error: 'Tiden är redan bokad',
//     krockarMed: krock._id
//   })
// }

export async function overlappar(a, b) {
  if (!a.start < b.end && !b.start < a.end) {
    const krock = await db.collection('bookings').findOne({
        resource_id: resursId,
        start: { $lt: nySlut },
        end:   { $gt: nyStart }
    })

    if (krock) {
        return res.status(409).json({
            error: 'Tiden är redan bokad',
            krockarMed: krock._id
        })
    }
  }
}

