import { useState } from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { globalStyles } from "../../global/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useColorMode } from "../context/ColorModeContext";

export const CreateAccountPage: React.FC = () => {
  const { isDarkMode } = useColorMode();
  const styles = globalStyles(isDarkMode);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  // Estados para gerenciar o formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para mensagens de erro no formulário
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Função para validar o e-mail e criar conta
  const handleSend = async () => {
    // Resetar mensagens
    setEmailError("");
    setSuccessMessage("");

    // Regex para validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      return;
    }

    const storedUsers = JSON.parse(
      (await AsyncStorage.getItem("users")) || "[]"
    );

    const userExists = storedUsers.some((u) => u.email === email);

    if (userExists) {
      setEmailError("E-mail já registrado.");
    } else {
      const newUser = { name, email, password };
      const updatedUsers = [...storedUsers, newUser];

      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

      setSuccessMessage(
        "Conta criada com sucesso, já poderá realizar o login."
      );

      setName("");
      setEmail("");
      setPassword("");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Resetar os estados ao focar na página
      setName("");
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setSuccessMessage("");
    }, [])
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { fontSize: 20, margin: 10 }]}>
          Crie uma nova conta
        </Text>
        <View>
          <View>
            {successMessage ? (
              <Text style={[styles.successText, { marginBottom: 10 }]}>
                {successMessage}
              </Text>
            ) : null}
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={[styles.input]}
              placeholder="Insira o seu nome"
              placeholderTextColor={"black"}
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
            />
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
          <TouchableOpacity onPress={handleSend}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Criar conta</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.bottomContainer, { flexDirection: "row" }]}>
        <Text style={{ color: "white" }}>Já possui uma conta? </Text>
        <TouchableOpacity onPress={handleBackToLogin}>
          <Text style={{ color: "white", textDecorationLine: "underline" }}>Voltar para login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
