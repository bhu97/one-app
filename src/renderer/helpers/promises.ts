export async function makePromise<T>(item: Promise<T> | T): Promise<T> {
  return item;
}

export default makePromise;
