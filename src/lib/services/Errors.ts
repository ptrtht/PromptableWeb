export class Errors {
  static async error(error: any) {
    return error;
  }

  static async warn(warn: any) {
    console.warn(warn);
  }
}
