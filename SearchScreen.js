import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import axios from 'axios';

const API_KEY = 'YOUR_TMDB_API_KEY'; // Substitua pela sua chave
const BASE_URL = 'https://api.themoviedb.org/3/search/multi'; // endpoint que busca filmes e séries

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  // Função para buscar na API da TMDB
  const searchMovies = async () => {
    if (searchQuery.trim() === '') return;
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          api_key: API_KEY,
          query: searchQuery,
          language: 'pt-BR', // para resultados em português
          page: 1
        }
      });
      setResults(response.data.results); // Array de filmes/séries retornados
    } catch (error) {
      console.error('Erro ao buscar dados na TMDB:', error);
    }
  };

  const renderItem = ({ item }) => {
    // 'title' para filmes, 'name' para séries
    const title = item.title || item.name;
    const imageUri = item.poster_path 
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
      : 'https://via.placeholder.com/200x300?text=No+Image';

    return (
      <TouchableOpacity 
        style={styles.itemContainer} 
        onPress={() => navigation.navigate('Details', { itemId: item.id, mediaType: item.media_type })}
      >
        <Image source={{ uri: imageUri }} style={styles.poster} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {/* Exemplo: exibir a data de lançamento se existir */}
          {item.release_date && <Text style={styles.info}>Lançamento: {item.release_date}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Busque Filmes ou Séries</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchMovies}
        />
        <Button title="Buscar" onPress={searchMovies} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  flatListContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: 80,
    height: 120,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
});
