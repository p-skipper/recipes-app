import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { globalStyles } from "../../global/globalStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import Icon6 from "@expo/vector-icons/FontAwesome6";
import { useColorMode } from "../context/ColorModeContext";

// Constante para armazenar a chave usada no AsyncStorage
const FAVORITES_KEY = "favorites";

export const RecipeDetailPage = () => {
  const { isDarkMode } = useColorMode();
  const styles = globalStyles(isDarkMode);

  const route = useRoute(); // Acesso aos parâmetros da navegação
  const { recipe } = route.params; // Obtém os detalhes da receita passada na navegação

  // Estado para gerenciar receitas favoritas
  const [favorites, setFavorites] = useState<string[]>([]);
  // Estado para gerenciar ingredientes utilizados
  const [ingredientUsed, setIngredientUsed] = useState<{
    [key: string]: boolean;
  }>({});
  const [isModalVisible, setModalVisible] = useState(false);

  // Carrega as receitas favoritas do AsyncStorage ao montar o componente
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  // Função para alternar o estado de favorito de uma receita
  const toggleFavorite = async () => {
    const updatedFavorites = favorites.includes(recipe.titulo)
      ? favorites.filter((title) => title !== recipe.titulo) // Remove dos favoritos
      : [...favorites, recipe.titulo]; // Adiciona aos favoritos

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites)); // Salva no AsyncStorage
  };

  // Alterna o estado "usado" de um ingrediente
  const toggleIngredientUsed = (ingredient: string) => {
    setIngredientUsed((prevState) => ({
      ...prevState,
      [ingredient]: !prevState[ingredient],
    }));
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Verifica se a receita está favoritada
  const isFavorited = favorites.includes(recipe.titulo);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Imagem da receita */}
        <Image source={{ uri: recipe.imagem }} style={styles.imageDetail} />
        <Text style={styles.titleDetail}>{recipe.titulo}</Text>

        {/* Detalhes da receita */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Informações sobre tempo e dificuldade */}
          <View style={[styles.titleRow, styles.detailsContainer, { flex: 2 }]}>
            <View style={styles.iconDetail}>
              <Icon name="clock" size={18} color="white" />
              <Text style={[styles.timeText, { fontWeight: "bold" }]}>
                {recipe.tempo} min
              </Text>
            </View>
            <View style={styles.iconDetail}>
              <Icon name="equalizer" size={18} color="white" />
              <Text style={[styles.timeText, { fontWeight: "bold" }]}>
                {recipe.dificuldade}
              </Text>
            </View>
          </View>

          {/* Botão de favoritar/desfavoritar */}
          <View style={[styles.titleRow, styles.detailsContainer, { flex: 1 }]}>
            <TouchableOpacity onPress={toggleFavorite}>
              <View style={styles.iconDetail}>
                <Icon
                  name={isFavorited ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color="white"
                />
                <Text style={[styles.timeText, { fontWeight: "bold" }]}>
                  {isFavorited ? "Favoritado" : "Favoritar"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição da receita */}
        <Text style={styles.descriptionDetail}>{recipe.descricao}</Text>

        {/* Seção de ingredientes */}
        <View style={[styles.titleRow, styles.detailsContainer]}>
          <View style={styles.iconDetail}>
            <Icon name="clipboard-list-outline" size={20} color="white" />
            <Text
              style={[styles.timeText, { fontWeight: "bold", fontSize: 15 }]}
            >
              Ingredientes
            </Text>
          </View>
          <View style={styles.iconDetail}>
            <Icon name="account-group" size={18} color="white" />
            <Text style={[styles.timeText, { fontWeight: "bold" }]}>
              {recipe.porcao} {recipe.porcao === 1 ? "Porção" : "Porções"}
            </Text>
          </View>
        </View>

        {/* Lista de ingredientes com checkbox */}
        <View style={{ marginBottom: 10 }}>
          {Object.entries(recipe.ingredientes).map(
            ([ingredient, quantity], index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={[
                    styles.stepText,
                    {
                      textDecorationLine: ingredientUsed[ingredient]
                        ? "line-through"
                        : "none", // Riscado se marcado
                    },
                  ]}
                >
                  {ingredient}: {quantity}
                </Text>
                <CheckBox
                  checked={ingredientUsed[ingredient] || false}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    padding: 0,
                    margin: 0,
                  }}
                  uncheckedIcon={
                    <Icon6
                      name="square"
                      size={18}
                      color={isDarkMode ? "white" : "black"}
                    />
                  }
                  checkedIcon={
                    <Icon6
                      name="square-check"
                      size={18}
                      color={isDarkMode ? "white" : "black"}
                    />
                  }
                  onPress={() => toggleIngredientUsed(ingredient)} // Marca/desmarca ingrediente
                />
              </View>
            )
          )}
        </View>

        {/* Seção de modo de preparo */}
        <View
          style={[
            styles.titleRow,
            styles.detailsContainer,
            { backgroundColor: isDarkMode ? "#36A9E1" : "#001529" },
          ]}
        >
          <View style={styles.iconDetail}>
            <Icon name="pot-steam-outline" size={20} color="white" />
            <Text
              style={[styles.timeText, { fontWeight: "bold", fontSize: 15 }]}
            >
              Modo de Preparo
            </Text>
          </View>
        </View>

        {/* Passos do modo de preparo */}
        <View style={{ marginBottom: 10 }}>
          {Object.entries(recipe.passos).map(([key, step], index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{parseInt(key)}.</Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            </View>
          ))}
        </View>
        <Image
          source={{ uri: recipe.imagem }}
          style={[styles.imageDetail, { marginBottom: 40 }]}
        />
      </ScrollView>
      {/* Floating button */}
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <Icon name="clipboard-list-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal para exibir os ingredientes */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ingredientes</Text>
            <ScrollView>
              {Object.entries(recipe.ingredientes).map(
                ([ingredient, quantity], index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        textDecorationLine: ingredientUsed[ingredient]
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {ingredient}: {quantity}
                    </Text>
                    <CheckBox
                      checked={ingredientUsed[ingredient] || false}
                      containerStyle={{
                        backgroundColor: "transparent",
                        borderWidth: 0,
                        padding: 0,
                        margin: 0,
                      }}
                      uncheckedIcon={
                        <Icon6 name="square" size={18} color="black" />
                      }
                      checkedIcon={
                        <Icon6 name="square-check" size={18} color="black" />
                      }
                      onPress={() => toggleIngredientUsed(ingredient)}
                    />
                  </View>
                )
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
