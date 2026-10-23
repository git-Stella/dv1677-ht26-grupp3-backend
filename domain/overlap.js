export async function overlappar(db, resourceObject, endsAt, startsAt, res) {
  const krock = await db.collection('bookings').findOne({
    resourceId: resourceObject,
    startsAt: { $lt: new Date(endsAt) },
    endsAt:   { $gt: new Date(startsAt) }
  });

  if (krock) {
    return res.status(409).json({
      error: 'Tiden är redan bokad',
      krockarMed: krock._id
    })
  }
}

