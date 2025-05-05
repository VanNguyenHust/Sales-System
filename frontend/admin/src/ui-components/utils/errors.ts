export class MissingProviderError extends Error {
  constructor(name: string, message = "") {
    super(`${message ? `${message} ` : message} Your application must be wrapped in an <${name}/> component.`);
    this.name = name;
  }
}
