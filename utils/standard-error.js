export class StandardError extends Error {
  constructor({ message, status }) {
    super(message);
    this.status = status;
  }
}
