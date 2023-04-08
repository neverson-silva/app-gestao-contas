import React from "react";
import { AuthContext } from "./auth.provider";

export function useAuth() {
  const context = React.useContext(AuthContext);
  return context;
}
