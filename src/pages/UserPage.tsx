import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import Icon from "react-native-vector-icons/FontAwesome6";
import { globalStyles } from "../../global/globalStyles";
import { useColorMode } from "../context/ColorModeContext";

export const UserPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { isDarkMode, toggleColorMode } = useColorMode();
  const styles = globalStyles(isDarkMode);

  const handleLoginRedirect = () => navigation.navigate("Login");

  return (
    <View style={styles.container}>
      <View style={[styles.content, {justifyContent: "center", alignItems: "center"}]}>
        {user ? (
          <>
            <Text style={styles.text}>Bem-vindo, {user.name}!</Text>
            <TouchableOpacity onPress={toggleColorMode}>
              <View style={[styles.iconDetail, styles.detailsContainer]}>
                <Icon
                  name={isDarkMode ? "moon" : "sun"}
                  size={20}
                  color="white"
                />
                <Text
                  style={[
                    styles.timeText,
                    {
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "white",
                    },
                  ]}
                >
                  Modo Escuro
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.text}>Você não está logado.</Text>
            <Button title="Ir para Login" onPress={handleLoginRedirect} />
          </>
        )}
      </View>
      
      <TouchableOpacity onPress={logout} style={styles.footer}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
