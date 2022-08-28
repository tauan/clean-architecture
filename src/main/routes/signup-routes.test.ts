import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await MongoHelper.disconnect();
});

beforeEach(async () => {
  const accountsCollection = MongoHelper.getCollection("accounts");
  await accountsCollection.deleteMany({});
});

describe("Signup routes", () => {
  test("Should return an accountn on success", async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Tauan Gabriel",
        email: "tauan@email.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200);
  });
});
