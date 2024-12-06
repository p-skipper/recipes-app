import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { globalStyles } from "../../global/globalStyles";
import { CheckBox } from "react-native-elements";
import Icon from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useColorMode } from "../context/ColorModeContext";

export const LoginPage: React.FC = () => {
  const { isDarkMode } = useColorMode();
  const styles = globalStyles(isDarkMode);

  const authContext = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Estados para gerenciar o formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // Estados para mensagens de erro no formulário
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Valida os campos do formulário e tenta realizar o login
  const validateAndLogin = () => {
    let valid = true;

    // Regex para validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Valida o e-mail
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      valid = false;
    } else {
      setEmailError("");
    }

    // Valida o tamanho da senha
    if (password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres.");
      valid = false;
    } else {
      setPasswordError("");
    }

    // Se tudo estiver válido, realiza o login
    if (valid) {
      handleLogin();
    }
  };

  // Realiza o login com base nos dados armazenados localmente
  const handleLogin = async () => {
    try {
      // Obter os usuários do AsyncStorage
      const storedUsers = JSON.parse(
        (await AsyncStorage.getItem("users")) || "[]"
      );

      // Verificar se o e-mail e senha correspondem
      const user = storedUsers.find(
        (u: { email: string; password: string }) =>
          u.email === email && u.password === password
      );

      if (user) {
        await authContext?.login(user);
        navigation.goBack();
      } else {
        setEmailError("Usuário ou senha inválidos.");
      }
    } catch (error) {
      console.error(error);
      setEmailError("Ocorreu um erro ao fazer login. Tente novamente.");
    }
  };
  // Navega para a página de "Esqueceu a senha"
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  // Navega para a página de criação de conta
  const handleCreateAccount = () => {
    navigation.navigate("CreateAccount");
  };

  useFocusEffect(
    React.useCallback(() => {
      // Resetar os estados ao focar na página
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setIsChecked(false);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { fontSize: 20, margin: 10 }]}>
          Faça login na sua conta
        </Text>
        <View>
          <View>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={[
                styles.input,
                emailError ? { marginBottom: 0 } : {}, // Ajusta margem caso haja mensagem de erro
              ]}
              placeholder="Insira o seu e-mail"
              placeholderTextColor={"black"}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(""); // Remove mensagem de erro ao digitar
              }}
            />
            {emailError ? (
              <Text style={[styles.errorText, { marginBottom: 10 }]}>
                {emailError}
              </Text>
            ) : null}
          </View>
          <View>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={[
                styles.input,
                passwordError ? { marginBottom: 0 } : {}, // Ajusta margem caso haja mensagem de erro
              ]}
              placeholder="Insira a sua senha"
              placeholderTextColor={"black"}
              secureTextEntry // Oculta a senha
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(""); // Remove mensagem de erro ao digitar
              }}
            />
            {passwordError ? (
              <Text style={[styles.errorText, { marginBottom: 10 }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>
          <View style={styles.details}>
            <CheckBox
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 0,
                margin: 0,
              }}
              textStyle={{
                color: "white",
                fontWeight: "normal"
              }}
              title="Lembrar de mim"
              checked={isChecked}
              uncheckedIcon={<Icon name="square" size={18} color="white" />}
              checkedIcon={<Icon name="square-check" size={18} color="white" />}
              onPress={() => setIsChecked(!isChecked)} // Alterna o estado do checkbox
            />
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={{ color: "#fff", fontWeight: "500", textDecorationLine: "underline" }}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={validateAndLogin}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.bottomContainer, { flexDirection: "row" }]}>
        <Text style={{ color: "white" }}>Novo Usuário? </Text>
        <TouchableOpacity onPress={handleCreateAccount}>
          <Text style={{ color: "white", textDecorationLine: "underline" }}>Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
