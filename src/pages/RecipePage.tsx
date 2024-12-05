import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CheckBox } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { recipes } from "../../recipes";
import { useCategory } from "../context/CategoryContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../global/globalStyles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Constante para armazenar a chave usada no AsyncStorage
const FAVORITES_KEY = "favorites";

// Função utilitária para remover acentos e normalizar texto
const removeAccents = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const RecipePage = () => {
  const { category, setCategory } = useCategory();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {

      const loadFavorites = async () => {
        setSearch("");
        setSelectedCategories(category ? [category] : []);
        setSelectedDifficulty([]);
        setSelectedTimeRanges([]);
        setIsLoading(true);
        setShowFavoritesOnly(false);

        setTimeout(async () => {
          const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
          setIsLoading(false);
        }, 1000);
      };
      loadFavorites();
    }, [category])
  );

  // Estados para gerenciar busca, favoritos e modais
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Estados para os filtros
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<number[]>([]);

  // Definição das faixas de tempo disponíveis para filtro
  const timeRanges = [
    { label: "0-5 min", max: 5 },
    { label: "5-15 min", max: 15 },
    { label: "15-30 min", max: 30 },
    { label: "30+ min", max: null },
  ];

  // Carrega receitas favoritas do armazenamento local quando o componente é montado
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);

      // Simula delay com setTimeout
      setTimeout(async () => {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
        setIsLoading(false);
      }, 2000);
    };
    loadFavorites();
  }, []);

  // Alterna o estado de favorito para uma receita
  const toggleFavorite = async (recipeTitle: string) => {
    const updatedFavorites = favorites.includes(recipeTitle)
      ? favorites.filter((title) => title !== recipeTitle)
      : [...favorites, recipeTitle];

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  // Adiciona ou remove uma categoria do filtro
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Adiciona ou remove uma dificuldade do filtro
  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulty((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // Adiciona ou remove uma faixa de tempo do filtro
  const toggleTimeRange = (rangeMax: number | null) => {
    setSelectedTimeRanges((prev) =>
      prev.includes(rangeMax)
        ? prev.filter((r) => r !== rangeMax)
        : [...prev, rangeMax]
    );
  };

  // Aplica todos os filtros selecionados às receitas
  const filteredRecipes = recipes.filter((r) => {
    const matchesCategory =
      selectedCategories.length > 0
        ? selectedCategories.includes(r.categoria)
        : true;
    const matchesDifficulty =
      selectedDifficulty.length > 0
        ? selectedDifficulty.includes(r.dificuldade)
        : true;
    const matchesTime =
      selectedTimeRanges.length > 0
        ? selectedTimeRanges.some((range) => {
            if (range === null) return r.tempo > 30;
            const rangeIndex = timeRanges.findIndex((t) => t.max === range);
            const lowerBound =
              rangeIndex > 0 ? timeRanges[rangeIndex - 1].max : 0;
            return r.tempo > lowerBound && r.tempo <= range;
          })
        : true;
    const matchesFavorites = showFavoritesOnly
      ? favorites.includes(r.titulo)
      : true;

    // Normaliza o texto da busca e dos títulos para comparação
    const normalizedTitle = removeAccents(r.titulo);
    const normalizedSearch = removeAccents(search);
    return (
      matchesCategory &&
      matchesDifficulty &&
      matchesTime &&
      matchesFavorites &&
      normalizedTitle.includes(normalizedSearch)
    );
  });

  // Função para navegar para a página de detalhes de uma receita
  const goToRecipeDetail = (recipe) => {
    navigation.navigate("RecipeDetail", { recipe });
  };

  return (
    <View style={globalStyles.container}>

      {/* Área de busca, botão de favoritos e filtro */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TextInput
          placeholder="Pesquisar..."
          placeholderTextColor={"black"}
          value={search}
          onChangeText={setSearch}
          style={[globalStyles.input, { height: 35, width: 250 }]}
        />

        <TouchableOpacity onPress={() => setShowFavoritesOnly((prev) => !prev)}>
          <Icon
            name={showFavoritesOnly ? "bookmark" : "bookmark-outline"}
            size={30}
            color={showFavoritesOnly ? "#062E56" : "#062E56"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-outline" size={30} color="#062E56" />
        </TouchableOpacity>
      </View>

      {/* Modal para filtros */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={globalStyles.titleContainer}>
                <Text style={globalStyles.modalTitle}>Filtrar Receitas</Text>
                <Icon
                  name="alpha-x-circle-outline"
                  size={25}
                  onPress={() => setFilterModalVisible(false)}
                />
              </View>

              <Text style={styles.filterLabel}>Categorias</Text>
              {["Café", "Acompanhamento", "Doce", "Principal"].map((cat) => (
                <CheckBox
                  key={cat}
                  title={cat}
                  checked={selectedCategories.includes(cat)}
                  onPress={() => toggleCategory(cat)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              ))}

              <Text style={styles.filterLabel}>Dificuldade</Text>
              {["Fácil", "Médio", "Difícil"].map((diff) => (
                <CheckBox
                  key={diff}
                  title={diff}
                  checked={selectedDifficulty.includes(diff)}
                  onPress={() => toggleDifficulty(diff)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              ))}

              <Text style={styles.filterLabel}>Tempo</Text>
              {timeRanges.map((range) => (
                <CheckBox
                  key={range.label}
                  title={range.label}
                  checked={selectedTimeRanges.includes(range.max)}
                  onPress={() => toggleTimeRange(range.max)}
                  containerStyle={styles.checkboxContainer}
                  textStyle={styles.checkboxText}
                />
              ))}

              <Button
                title="Aplicar Filtros"
                onPress={() => setFilterModalVisible(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.titulo}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            showFavoritesOnly && favorites.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhuma receita foi favoritada ainda.
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                Nenhuma receita encontrada para "{search}".
              </Text>
            )
          }
          renderItem={({ item }) => {
            const isFavorited = favorites.includes(item.titulo);

            return (
              <TouchableWithoutFeedback onPress={() => goToRecipeDetail(item)}>
                <View style={styles.recipeCard}>
                  <Image
                    source={{ uri: item.imagem }}
                    style={globalStyles.image}
                  />
                  <View style={globalStyles.content}>
                    <View style={globalStyles.titleRow}>
                      <Text style={globalStyles.title}>{item.titulo}</Text>
                      <View style={globalStyles.iconDetail}>
                        <Icon
                          name="clock"
                          size={16}
                          color="#36A9E1"
                          style={globalStyles.icon}
                        />
                        <Text style={[globalStyles.timeText, {color: "#36A9E1"}]}>
                          {item.tempo} min
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={globalStyles.description}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.descricao || "Sem descrição."}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.bookmarkContainer}
                    onPress={() => toggleFavorite(item.titulo)}
                  >
                    <Icon
                      name={isFavorited ? "bookmark" : "bookmark-outline"}
                      size={22}
                      color={isFavorited ? "#36A9E1" : "#36A9E1"}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingTop: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  checkboxContainer: {
    marginBottom: 10,
    paddingLeft: 0,
  },
  checkboxText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 20,
  },
  recipeCard: {
    marginBottom: 20,
    backgroundColor: "#001529",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderLeftColor: "#062E56",
    borderLeftWidth: 7,
    flexDirection: "row",
    height: 120,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookmarkContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
