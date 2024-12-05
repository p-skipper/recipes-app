import React, {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

{/* Interface que define a estrutura de dados do usuário ao fazer login */}
export interface LoginResponse {
  email: string;
  password: string;
}

{/* Definindo o tipo do contexto de autenticação */}
export interface AuthContextType {
  user?: LoginResponse;
  login: (login: LoginResponse) => void;
  logout: () => void;
  loadUserData: () => void;
}

{/* Criando o contexto de autenticação com valor inicial indefinido */}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

{/* Provider de autenticação para gerenciar estado de login/logout e persistência */}
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse | undefined>();

  {/* Função para carregar os dados do usuário armazenados no AsyncStorage */}
  const loadUserData = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      const userObject: LoginResponse = JSON.parse(storedUser); {/* Parse da string JSON para objeto */}
      setUser(userObject); {/* Atualiza o estado com o usuário encontrado */}
    }
  };

  {/* Carregar dados do usuário quando o componente for montado */}
  useEffect(() => {
    loadUserData(); {/* Chama a função para carregar os dados do usuário */}
  }, []);

  {/* Função de login: salva os dados do usuário no estado e no AsyncStorage */}
  const login = async (login: LoginResponse) => {
    setUser(login); {/* Atualiza o estado com o novo usuário */}
    await AsyncStorage.setItem("user", JSON.stringify(login)); {/* Salva os dados do usuário no AsyncStorage */}
  };

  {/* Função de logout: remove o usuário do estado e do AsyncStorage */}
  const logout = async () => {
    setUser(undefined); {/* Limpa o estado de usuário */}
    await AsyncStorage.removeItem("user"); {/* Remove os dados do usuário no AsyncStorage */}
  };

  {/* Fornecendo o contexto de autenticação para os componentes filhos */}
  return (
    <AuthContext.Provider value={{ user, login, logout, loadUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

{/* Hook para acessar o contexto de autenticação em outros componentes */}
export const useAuth = () => useContext(AuthContext);
