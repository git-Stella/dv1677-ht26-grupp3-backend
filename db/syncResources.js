import { getClient } from './database.mjs';
import { broker } from '../config/broker.js';

export async function syncResources() {
  const client = await getClient();
  const db = client.db(process.env.DATABASE_NAME);

  const sources = { proxmox: 'nodes', maas: 'machines', openstack: 'projects' };
  const start = new Date()

  for (const [provider, key] of Object.entries(sources)) {
    const inventory = await broker.inventory(provider);

    for (const r of inventory[key] ?? []) {
      await db.collection('resources').updateOne(
        { provider, externalId: r.id },
        { $set: { name: r.name, capacity: r.capacity, active: true, syncedAt: start } },
        { upsert: true },
      );
    };
  };

  await db.collection('resources').updateMany({ syncedAt: { $lt: start } }, { $set: { active: false } })
};
