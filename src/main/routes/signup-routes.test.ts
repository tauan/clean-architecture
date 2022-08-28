import request from "supertest";
import app from "../config/app";

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
