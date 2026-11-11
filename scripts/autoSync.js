import { syncResources } from "../db/syncResources.js";

const time = 5 * 60 * 1000;

async function autoSync() {
    try {
        await syncResources();
        console.log("Resource inventory synced.");
    } catch (e) {
        console.error("Couldn't sync resource inventory: ", e);
    } finally {
        setTimeout(autoSync, time);
    }
}

autoSync();
