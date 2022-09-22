import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepositoryStub {
    async log(stack: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          name: "Tauan",
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        email: "any@email.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  test("Should return the same result of the controller", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any@email.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const response = await sut.handle(httpRequest);
    expect(response).toEqual({
      statusCode: 200,
      body: {
        name: "Tauan",
      },
    });
  });

  test("Should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest
      .spyOn(controllerStub, "handle")
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(serverError(fakeError)))
      );

    const httpRequest = {
      body: {
        email: "any@email.com",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith("any_stack");
  });
});
