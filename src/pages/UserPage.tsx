import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

export const UserPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLoginRedirect = () => navigation.navigate("Login");

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Bem-vindo, {user.name}!</Text>
          <Button title="Sair" onPress={logout} />
        </>
      ) : (
        <>
          <Text style={styles.text}>Você não está logado.</Text>
          <Button title="Ir para Login" onPress={handleLoginRedirect} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
