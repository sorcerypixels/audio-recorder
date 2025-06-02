export function throwPermissionError(str: string): never {
  const newError = new Error(str);
  newError.name = "Permission Error";
  throw newError;
}
