import { plainToClass } from "class-transformer";
import * as SecureStore from "expo-secure-store";

export const storeItem = async (key: string, item: any) => {
  await SecureStore.setItemAsync(
    key,
    typeof item === "string" ? item : JSON.stringify(item)
  );
};

export const getStoredItem = async (key: string): Promise<string | null> => {
  const result = await SecureStore.getItemAsync(key);

  return result;
};

export async function getStoredObject<T>(key: string): Promise<T | null> {
  const result = await getStoredItem(key);
  return result ? jsonToClass<T>(result) : null;
}

function jsonToClass<T>(json: string): T {
  const object = JSON.parse(json);
  const clazz = getClass<T>(object);
  const instance = plainToClass(clazz, object);
  return instance;
}

function getClass<T>(object: any): { new (): T } {
  if (object && typeof object === "object" && object.constructor !== Object) {
    return object.constructor;
  }
  throw new Error("Could not find class");
}

export const deleteStoredItems = async (...keys: string[]) => {
  for (const key of keys) {
    await SecureStore.deleteItemAsync(key);
  }
};
