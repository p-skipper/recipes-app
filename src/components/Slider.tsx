import React from "react";
import {
  Dimensions,
  Image,
  FlatList,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { recipes } from "../../recipes";
import { StackNavigationProp } from "@react-navigation/stack";

// Obtém a largura da tela do dispositivo
const { width } = Dimensions.get("screen");

export const Slider = () => {
  const sliderRecipes = recipes.filter((recipe) => recipe.slider);
  const navigation = useNavigation<StackNavigationProp<any>>();

  // Função para navegar para a página de detalhes de uma receita
  const goToRecipeDetailPage = (recipe) => {
    navigation.navigate("Receitas");
    
    setTimeout(() => {
      navigation.navigate("RecipeDetail", { recipe });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <FlatList
        // Dados do carrossel
        data={sliderRecipes}
        // Renderiza cada item do carrossel (imagem)
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {/* Exibe a imagem do item */}
            <TouchableWithoutFeedback onPress={() => goToRecipeDetailPage(item)}>
              <Image source={{ uri: item.imagem }} style={styles.image} />
            </TouchableWithoutFeedback>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Permite transição de uma "página" (imagem) por vez
        keyExtractor={(item, index) => index.toString()}
        snapToInterval={width} // Faz o carrossel "pular" por intervalos de largura de tela
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
});
