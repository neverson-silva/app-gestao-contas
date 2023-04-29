import {
  STORAGE_APP_DATA_VALIDADE_TOKEN,
  STORAGE_APP_TOKEN,
  STORAGE_APP_LOGIN,
} from "@constants/storage.constants";
import { getStoredItem, deleteStoredItems, storeItem } from "@utils/util";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import jwtDecode from "jwt-decode";
import { api } from "@utils/api";
import { Usuario } from "@models/auth";
import moment from "moment";

type AuthContextData = {
  usuario: Usuario;
  logado: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  temPermissao: (...permisses: string[]) => boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextData>(
  {} as unknown as AuthContextData
);

export const AuthProvider: React.FC<PropsWithChildren<any>> = ({
  children,
}) => {
  const [usuario, setUsuario] = useState<Usuario | null | undefined>();

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const response = await api.login(username, password);
      response.roles = response.roles.map((role: any) => role.authority);

      //@ts-ignore
      delete response.senha;
      //@ts-ignore
      delete response.accessToken;

      setUsuario(response);

      return true;
    },
    [usuario]
  );

  const temPermissao = (...roles: string[]): boolean => {
    if (roles == undefined || roles.length == 0) {
      return false;
    }
    return usuario?.roles.some((role) => roles.includes(role)) ?? false;
  };

  const logout = useCallback(async (): Promise<boolean> => {
    setUsuario(undefined);
    await deleteStoredItems(
      STORAGE_APP_LOGIN,
      STORAGE_APP_DATA_VALIDADE_TOKEN,
      STORAGE_APP_TOKEN
    );
    return true;
  }, [usuario]);

  const isAdmin = useMemo(() => temPermissao("ROLE_ADMIN"), [usuario]);

  const checkIsLogado = async () => {
    const token = await getStoredItem(STORAGE_APP_TOKEN);
    const expiresIn = await getStoredItem(STORAGE_APP_DATA_VALIDADE_TOKEN);

    let deslogar = false;
    if (!token) {
      deslogar = true;
    }
    
    if (expiresIn && moment().isSameOrAfter(expiresIn)) {
      deslogar = true
    }

    if (deslogar) {
      await logout()
    } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const parsed = jwtDecode(token)?.usuario as unknown as Usuario;
        setUsuario(parsed);
    }

  }

  useEffect(() => {
    checkIsLogado()
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario: usuario!,
        login,
        logout,
        logado: !!usuario,
        temPermissao,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
