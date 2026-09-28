import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync } from 'fs'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app.js'
import { connectDB, closeDB } from '../database.js'

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.DATABASE_NAME = 'jsramverk_test'

  // Seed med kursdata så att testerna har något att arbeta med
  const courses = JSON.parse(readFileSync('./courses.json', 'utf-8'))
  const db = await connectDB()
  await db.collection('courses').insertMany(courses)
});

afterAll(async () => {
  await closeDB()
  await mongod.stop()
});