import * as SecureStore from "expo-secure-store";
import moment from "moment";

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

export const formatarMoeda = (valor: string | number): string => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatter.format(Number(valor));
};

export const converterMoedaEmFloat = (valor: string): number => {
  return parseFloat(
    valor
      .replace("R$", "") // Remove o símbolo de moeda
      .replace(/\./g, "") // Remove o separador de milhares
      .replace(",", ".") // Substitui a vírgula decimal por um ponto
  );
};

export const formatarData = (
  data: string | Date | moment.Moment,
  format = "DD/MM/YYYY"
): string => {
  return moment(data).format(format);
};

export const delay = (time: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};
