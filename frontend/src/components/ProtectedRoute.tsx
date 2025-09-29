import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { token } = useContext(AuthContext);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};
