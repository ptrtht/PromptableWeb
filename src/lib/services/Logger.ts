export class Logger {
  static log(message: string | Record<string, any>) {
    console.log(JSON.stringify({ message }));
  }

  static warn(message: string | Record<string, any>) {
    console.warn(JSON.stringify({ message }));
  }

  // any number of args
  static error(error: Error | string, ...optionalParams: any[]) {
    console.error(error, ...optionalParams);
  }
}
