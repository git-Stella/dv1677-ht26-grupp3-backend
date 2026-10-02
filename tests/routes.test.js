import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync } from 'fs'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app.mjs'
import { connectDB, closeDB, testDatabase } from '../db/database.mjs'

let mongod

beforeAll(async () => {
  //mongod = await MongoMemoryServer.create()
  //process.env.MONGODB_URI = mongod.getUri()
  //process.env.DATABASE_NAME = 'jsramverk_test'

  // Seed med kursdata så att testerna har något att arbeta med
  //const courses = JSON.parse(readFileSync('./courses.json', 'utf-8'))
  //const db = await connectDB()
  const db = await testDatabase();
  //await db.collection('courses').insertMany(courses)
});

afterAll(async () => {
  //await closeDB()
  //await mongod.stop()
});

describe('GET /api', () => {
    it('svarar med resources array', async () => {
        const res = await request(app).get('/api').expect(200)
        expect(res.body.resources).toBeInstanceOf(Array)
        expect(res.body.resources.length).toBeGreaterThan(0)
    })
})

describe('POST /api/resources', () => {
    it('skapar en resource', async () => {
        const res = await request(app).post('/api/resources').send(
            { name: "VM-07", type: "vm", description: "test", capacity: 2 }
        )
        expect(res.body.result).toBeInstanceOf(Array)
        expect(res.body.result.length).toBeGreaterThan(0)
        //https://stackoverflow.com/questions/19253753/javascript-find-json-value
        expect(res.body.result.find(item => item.name == "VM-07"))
    })
})

describe('DELETE /api/resources', () => {
    it('tar bort en resource', async () => {
        const res = await request(app).post('/api/resources').send(
            { name: "VM-09", type: "vm", description: "testdel", capacity: 2 }
        )
        expect(res.body.result).toBeInstanceOf(Array)
        expect(res.body.result.length).toBeGreaterThan(0)
        //https://stackoverflow.com/questions/19253753/javascript-find-json-value
        const toDel = res.body.result.find(item => item.name == "VM-09")
        //expect(res.body.result.find(item => item.name == "VM-09"))
        const res2 = await request(app).delete(`/api/resources/VM-09`)
        expect(res2.body.result.changes)
    })
})