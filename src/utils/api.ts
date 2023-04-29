import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Usuario } from "@models/auth";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Alert } from "react-native";
import { getStoredItem, storeItem } from "./util";
import {
  STORAGE_APP_DATA_VALIDADE_TOKEN,
  STORAGE_APP_TOKEN,
} from "@constants/storage.constants";

export class ApiService {
  private readonly BASE_URL =
    "https://api-gestao-contas-eqilywar6a-uc.a.run.app";
  // private readonly BASE_URL = 'http://localhost:9090'

  private _axios: AxiosInstance;
  // private token: string | null
  // private expiresIn: Date | null

  constructor() {
    this._axios = axios.create({
      baseURL: this.BASE_URL,
    });
  }

  async login(conta: string, senha: string): Promise<Usuario> {
    return await this.post("/auth/login", { conta, senha })
      .then((response) => {
        storeItem(STORAGE_APP_TOKEN, response.data.accessToken);

        const decoded = new Date(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Number(jwtDecode(response.data.accessToken).exp) * 1000
        );

        storeItem(
          STORAGE_APP_DATA_VALIDADE_TOKEN,
          moment(decoded).toISOString()
        );

        return response.data;
      })
      .catch((err) => {
        if (
          err?.response?.status === 401 ||
          err?.response?.data?.message === "Bad credentials"
        ) {
          Alert.alert(
            "Falha na autenticação",
            "Usuário e/ou senha inválidos, tente novamente"
          );
          return;
        }
      });
  }

  private async getAuthHeaders(
    config?: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const token = await getStoredItem(STORAGE_APP_TOKEN);
    const expiresIn = await getStoredItem(STORAGE_APP_DATA_VALIDADE_TOKEN);

    if (!token) {
      return {};
    }
    if (expiresIn && moment().isSameOrAfter(expiresIn)) {
      Alert.alert("Ocorreu um erro", "Credenciais inválidas");
    }

    if (config) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!config.headers) {
        config.headers = {};
      }
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as unknown as AxiosRequestConfig;
    }
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.get(url, await this.getAuthHeaders(config));
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.delete(url, await this.getAuthHeaders(config));
  }

  async options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.options(url, await this.getAuthHeaders(config));
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.post(url, data, await this.getAuthHeaders(config));
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.put(url, data, await this.getAuthHeaders(config));
  }

  async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.patch(
      url,
      data,
      await this.getAuthHeaders(config)
    );
  }
}

export const api = new ApiService();
