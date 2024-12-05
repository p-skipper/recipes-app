import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { globalStyles } from "../../global/globalStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CheckBox } from "react-native-elements";
import Icon6 from "@expo/vector-icons/FontAwesome6";

// Constante para armazenar a chave usada no AsyncStorage
const FAVORITES_KEY = "favorites";

export const RecipeDetailPage = () => {
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
        <Image source={{ uri: recipe.imagem }} style={styles.image} />
        <Text style={styles.title}>{recipe.titulo}</Text>

        {/* Detalhes da receita */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Informações sobre tempo e dificuldade */}
          <View
            style={[
              globalStyles.titleRow,
              globalStyles.detailsContainer,
              { flex: 2, backgroundColor: "#001529" },
            ]}
          >
            <View style={globalStyles.iconDetail}>
              <Icon name="clock" size={18} color="white" />
              <Text style={[globalStyles.timeText, { fontWeight: "bold" }]}>
                {recipe.tempo} min
              </Text>
            </View>
            <View style={globalStyles.iconDetail}>
              <Icon name="equalizer" size={18} color="white" />
              <Text style={[globalStyles.timeText, { fontWeight: "bold" }]}>
                {recipe.dificuldade}
              </Text>
            </View>
          </View>

          {/* Botão de favoritar/desfavoritar */}
          <View
            style={[
              globalStyles.titleRow,
              globalStyles.detailsContainer,
              { flex: 1, backgroundColor: "#001529" },
            ]}
          >
            <TouchableOpacity onPress={toggleFavorite}>
              <View style={globalStyles.iconDetail}>
                <Icon
                  name={isFavorited ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color="white"
                />
                <Text style={[globalStyles.timeText, { fontWeight: "bold" }]}>
                  {isFavorited ? "Favoritado" : "Favoritar"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição da receita */}
        <Text style={styles.description}>{recipe.descricao}</Text>

        {/* Seção de ingredientes */}
        <View
          style={[
            globalStyles.titleRow,
            globalStyles.detailsContainer,
            { backgroundColor: "#001529" },
          ]}
        >
          <View style={globalStyles.iconDetail}>
            <Icon name="clipboard-list-outline" size={20} color="white" />
            <Text
              style={[
                globalStyles.timeText,
                { fontWeight: "bold", fontSize: 15 },
              ]}
            >
              Ingredientes
            </Text>
          </View>
          <View style={globalStyles.iconDetail}>
            <Icon name="account-group" size={18} color="white" />
            <Text style={[globalStyles.timeText, { fontWeight: "bold" }]}>
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
                  style={{
                    textDecorationLine: ingredientUsed[ingredient]
                      ? "line-through"
                      : "none", // Riscado se marcado
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
                  onPress={() => toggleIngredientUsed(ingredient)} // Marca/desmarca ingrediente
                />
              </View>
            )
          )}
        </View>

        {/* Seção de modo de preparo */}
        <View
          style={[
            globalStyles.titleRow,
            globalStyles.detailsContainer,
            { backgroundColor: "#062E56" },
          ]}
        >
          <View style={globalStyles.iconDetail}>
            <Icon name="pot-steam-outline" size={20} color="white" />
            <Text
              style={[
                globalStyles.timeText,
                { fontWeight: "bold", fontSize: 15 },
              ]}
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  stepNumberContainer: {
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#36A9E1",
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001529",
  },
  stepTextContainer: {
    flex: 1,
  },
  stepText: {
    fontSize: 16,
    flexWrap: "wrap",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#36A9E1",
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalItem: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#36A9E1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
