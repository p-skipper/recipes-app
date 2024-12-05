import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { HomePage } from "./src/pages/HomePage";
import { RecipePage } from "./src/pages/RecipePage";
import { RecipeDetailPage } from "./src/pages/RecipeDetailPage";
import { LoginPage } from "./src/pages/LoginPage";
import { UserPage } from "./src/pages/UserPage";
import { ForgotPasswordPage } from "./src/pages/ForgotPasswordPage";
import { CreateAccountPage } from "./src/pages/CreateAccountPage";
import { CategoryProvider } from "./src/context/CategoryContext";
import Icon from "react-native-vector-icons/FontAwesome6";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header } from "./src/components/Header";
import { AuthProvider } from "./src/context/AuthContext";

export type RootTabParamList = {
  Home: undefined;
  Receitas: undefined;
  Opções: undefined;
};

export type RootStackParamList = {
  User: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  CreateAccount: undefined;
  RecipePage: undefined;
  RecipeDetail: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const RecipeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RecipePage" component={RecipePage} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailPage} />
  </Stack.Navigator>
);

const UserStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="User" component={UserPage} />
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
    <Stack.Screen name="CreateAccount" component={CreateAccountPage} />
  </Stack.Navigator>
);

const Navigation = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: "#062E56",
      tabBarInactiveTintColor: "gray",
      header: () => <Header />,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomePage}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => (
          <Icon name="house" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Receitas"
      component={RecipeStackNavigator}
      options={{
        tabBarLabel: "Receitas",
        tabBarIcon: ({ color, size }) => (
          <Icon name="book" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Opções"
      component={UserStackNavigator}
      options={{
        tabBarLabel: "Opções",
        tabBarIcon: ({ color, size }) => (
          <Icon name="user-large" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
