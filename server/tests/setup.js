import { beforeAll, afterAll, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Tests never touch your real Atlas database — mongodb-memory-server
// spins up a real, temporary, throwaway MongoDB instance for the
// duration of the test run, entirely on your own machine.
let mongoServer;

// Signals to the rate-limit middleware (authRateLimit.js, aiRateLimit.js)
// that it should skip limiting entirely, so tests that call the same
// route many times in a row don't trip their own rate limits.
process.env.NODE_ENV = "test";

// Tests never load your real .env file, so anything a controller reads
// from process.env needs a stand-in value here. Add to this as tests
// start covering more routes that need other secrets.
process.env.USER_JWT_SECRET = "test-only-secret-not-a-real-key";
process.env.ADMIN_JWT_SECRET = "test-only-admin-secret-not-a-real-key";

// These two aren't needed by any route this test suite actually calls
// — but configs/imageKit.js and configs/gemini.js both construct their
// client objects the moment they're IMPORTED, not when they're used.
// Since importing app.js pulls in every route (and therefore every
// controller's imports) regardless of which routes a given test file
// is actually exercising, these constructors run unconditionally —
// ImageKit's throws outright without a publicKey, so it needs a
// placeholder even though no test here ever uploads an image.
process.env.IMAGEKIT_PUBLIC_KEY = "test-public-key";
process.env.IMAGEKIT_PRIVATE_KEY = "test-private-key";
process.env.IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/test";
process.env.GEMINI_API_KEY = "test-gemini-key";
process.env.RESEND_API_KEY = "test-resend-key";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Wipe every collection after each test, so one test's leftover data
// can never affect another test's expectations — every test starts
// from a clean, empty database.
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});