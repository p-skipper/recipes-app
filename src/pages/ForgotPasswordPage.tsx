import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../global/globalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ForgotPasswordPage: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Estados para gerenciar o formulário
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  // Função para validar o e-mail e enviar instruções
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
  
    try {
      // Obter os usuários do AsyncStorage
      const storedUsers = JSON.parse(await AsyncStorage.getItem("users") || "[]");
  
      // Verificar se o e-mail existe
      const userExists = storedUsers.some(
        (u: { email: string }) => u.email === email
      );
  
      if (!userExists) {
        setEmailError("E-mail não registrado.");
      } else {
        setSuccessMessage(
          "Em breve você receberá instruções para redefinir sua senha."
        );
      }
    } catch (error) {
      console.error(error);
      setEmailError("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Resetar os estados ao focar na página
      setEmail("");
      setEmailError("");
      setSuccessMessage("");
    }, [])
  );
  
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.formContainer}>
        <Text style={[globalStyles.title, { fontSize: 20, margin: 10 }]}>
          Esqueceu sua senha?
        </Text>
        <View>
          <View>
            <Text style={globalStyles.label}>E-mail:</Text>
            <TextInput
              style={[
                globalStyles.input,
                emailError || successMessage ? { marginBottom: 0 } : {}, // Ajusta margem caso haja mensagem
              ]}
              placeholder="Insira o seu e-mail"
              placeholderTextColor={"black"}
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(""); // Remove mensagem de erro ao digitar
                setSuccessMessage(""); // Remove mensagem de sucesso ao digitar
              }}
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={[globalStyles.errorText, { marginBottom: 10 }]}>
                {emailError}
              </Text>
            ) : null}
            {successMessage ? (
              <Text style={[globalStyles.successText, { marginBottom: 10 }]}>
                {successMessage}
              </Text>
            ) : null}
          </View>
          <View style={globalStyles.details}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={{ color: "white" }}>« Voltar para login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSend}>
            <View style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Enviar</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={globalStyles.bottomContainer}>
        <Text style={{ color: "white", textAlign: "center" }}>
          Insira seu endereço de e-mail e enviaremos instruções sobre como criar
          uma nova senha.
        </Text>
      </View>
    </SafeAreaView>
  );
};