import { getClient } from './database.mjs';
import { broker } from '../config/broker.js';

export async function syncResources() {
  const client = await getClient();
  const db = client.db(process.env.DATABASE_NAME);

  const sources = { proxmox: 'nodes', maas: 'machines', openstack: 'projects' };

  for (const [provider, key] of Object.entries(sources)) {
    const inventory = await broker.inventory(provider);

    for (const r of inventory[key] ?? []) {
      await db.collection('resources').updateOne(
        { provider, externalId: r.id },
        { $set: { name: r.name, capacity: r.capacity, active: true } },
        { upsert: true },
      );
    };
  };
};
