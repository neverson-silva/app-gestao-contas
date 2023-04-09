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
  return result ? (JSON.parse(result) as T) : null;
}

export const deleteStoredItems = async (...keys: string[]) => {
  for (const key of keys) {
    await SecureStore.deleteItemAsync(key);
  }
};
