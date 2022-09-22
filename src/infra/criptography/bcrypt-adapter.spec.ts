import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(param?: string): Promise<string> {
    return new Promise((resolve) => resolve("hash"));
  },
}));

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  test("Should call bcrypt with correct values", async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, "hash");

    await sut.encrypt("any_value");

    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("Should return a hash on success", async () => {
    const sut = makeSut();

    const hash = await sut.encrypt("any_value");

    expect(hash).toBe("hash");
  });

  test("Should throw if bcrypt throes", async () => {
    const sut = makeSut();

    jest
      .spyOn(bcrypt, "hash")
      .mockReturnValueOnce(
        new Promise((_resolve, reject) =>
          reject(new Error())
        ) as unknown as void
      );

    const promise = sut.encrypt("any_value");

    expect(promise).rejects.toThrow();
  });
});
