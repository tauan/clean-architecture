import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve("hashed_password"));
      }
    }
    const encryptStub = new EncrypterStub();
    const sut = new DbAddAccount(encryptStub);
    const encryptSpy = jest.spyOn(encryptStub, "encrypt");
    const accountData = {
      name: "valid name",
      email: "valid email",
      password: "valid password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid password");
  });
});
