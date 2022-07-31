import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from "../protocols";
import { badRequest, serverError } from "../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../errors";
import { AddAccount } from "../../domain/usecases/add-account";

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFilds = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFilds) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isValid = this.emailValidator.isValid(email);

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      this.addAccount.add({
        name,
        email,
        password,
      });
      return {
        statusCode: 200,
        body: "",
      };
    } catch (error) {
      return serverError();
    }
  }
}
