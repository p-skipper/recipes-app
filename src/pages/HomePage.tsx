import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useCategory } from "../context/CategoryContext";
import { StackActions, useNavigation } from "@react-navigation/native";
import { RootTabParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import { Slider } from "../components/Slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { globalStyles } from "../../global/globalStyles";
import { recipes } from "../../recipes";

type HomeScreenNavigationProp = StackNavigationProp<RootTabParamList, "Home">;

export const HomePage = () => {
  const { setCategory } = useCategory(); // Define a categoria selecionada.
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Hook de navegação para gerenciar rotas.

  const [isLoading, setIsLoading] = useState(true); // Estado para gerenciar o carregamento inicial.

  // Função para tratar o clique em uma categoria e navegar para a tela de receitas.
  const handlePress = (category: string) => {
    setCategory(category);
    navigation.navigate("Receitas");
    navigation.dispatch(StackActions.popToTop()); // Garante que a pilha seja redefinida.
  };

  // Navega para a página de detalhes de uma receita específica.
  const goToRecipeDetailPage = (recipe) => {
    navigation.navigate("Receitas");
    setTimeout(() => {
      navigation.navigate("RecipeDetail", { recipe }); // Aguarda um tempo antes de redirecionar.
    }, 100);
  };

  // Filtra receitas destacadas.
  const destaqueRecipes = recipes.filter((recipe) => recipe.destaque);

  // Simula um carregamento inicial.
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={[globalStyles.container, { paddingTop: 10 }]}>
      {/* Slider com imagens/banner */}
      <Slider />

      {/* Botões de categorias */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => handlePress("Café")}
        >
          <View style={styles.iconContainer}>
            <Icon name="coffee-outline" size={24} color={"#e0efff"} />
          </View>
          <View style={styles.button}>
            <Text style={styles.category}>Lanche</Text>
          </View>
        </TouchableOpacity>
        {/* Repete o padrão acima para outras categorias */}
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => handlePress("Principal")}
        >
          <View style={styles.iconContainer}>
            <Icon name="silverware-variant" size={24} color={"#e0efff"} />
          </View>
          <View style={styles.button}>
            <Text style={styles.category}>Principal</Text>
          </View>
        </TouchableOpacity>
        {/* Outras categorias */}
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => handlePress("Acompanhamento")}
        >
          <View style={styles.iconContainer}>
            <Icon name="bowl-mix-outline" size={24} color={"#e0efff"} />
          </View>
          <View style={styles.button}>
            <Text style={[styles.category, { fontSize: 12 }]}>
              Acompanhamento
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => handlePress("Doce")}
        >
          <View style={styles.iconContainer}>
            <Icon name="ice-cream" size={24} color={"#e0efff"} />
          </View>
          <View style={styles.button}>
            <Text style={styles.category}>Doce</Text>
          </View>
        </TouchableOpacity>
        {/* Botão para mostrar todas as categorias */}
        <TouchableOpacity
          style={styles.showAll}
          onPress={() => handlePress("")}
        >
          <View>
            <Text style={[styles.category, { fontSize: 14 }]}>
              Mostrar Todas
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Indicador de carregamento ou lista de receitas */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3478a1" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <>
          {/* Destaques */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[globalStyles.title, { fontSize: 18, color: "#001529" }]}>
              Destaques
            </Text>
            <View style={styles.division}></View>
          </View>

          {/* Lista horizontal de receitas em destaque */}
          <FlatList
            data={destaqueRecipes}
            keyExtractor={(item) => item.titulo} // Identifica cada item pela chave `titulo`.
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ gap: 20, paddingTop: 10 }}
            renderItem={({ item }) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => goToRecipeDetailPage(item)}
                >
                  <View style={styles.recipeContainer}>
                    {/* Imagem da receita */}
                    <Image
                      source={{ uri: item.imagem }}
                      style={[globalStyles.image, { width: 130, height: 100 }]}
                    />
                    {/* Informações da receita */}
                    <View style={[globalStyles.content, { paddingTop: 0 }]}>
                      <View style={globalStyles.titleRow}>
                        <Text style={[globalStyles.title, { fontSize: 14 }]}>
                          {item.titulo}
                        </Text>
                      </View>
                      <Text
                        style={globalStyles.description}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {item.descricao || "Sem descrição."}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    width: 120,
    height: 50,
    padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#062E56",
    alignItems: "center",
    justifyContent: "center",
  },
  showAll: {
    width: "100%",
    height: 30,
    backgroundColor: "#062E56",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  category: {
    color: "#e0efff",
    fontSize: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#001529",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  division: {
    height: 1,
    width: "70%",
    backgroundColor: "#001529",
  },
  recipeContainer: {
    borderRadius: 10,
    borderColor: "#062E56",
    borderWidth: 1,
    minHeight: 230,
    width: 150,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3478a1",
  },
});
