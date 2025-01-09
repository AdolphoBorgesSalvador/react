import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_KEY = 'YOUR_TMDB_API_KEY';

export default function DetailsScreen({ route }) {
  const { itemId, mediaType } = route.params; 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      // Define o endpoint de acordo com o tipo (movie ou tv)
      const endpoint = mediaType === 'movie' 
        ? `https://api.themoviedb.org/3/movie/${itemId}`
        : `https://api.themoviedb.org/3/tv/${itemId}`;

      const response = await axios.get(endpoint, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR'
        }
      });
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Não foi possível carregar os detalhes</Text>
      </View>
    );
  }

  // Ajusta variáveis de acordo com se é filme ou série
  const title = details.title || details.name;
  const imageUri = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';
  const overview = details.overview || 'Sem sinopse disponível.';

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.poster} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.overview}>{overview}</Text>

      {/* Exemplo: se for filme, exibir data de lançamento; se for série, exibir data de primeira exibição */}
      {mediaType === 'movie' && (
        <Text style={styles.info}>
          Lançamento: {details.release_date || 'Não disponível'}
        </Text>
      )}
      {mediaType === 'tv' && (
        <Text style={styles.info}>
          Primeira Exibição: {details.first_air_date || 'Não disponível'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  poster: {
    width: 200,
    height: 300,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  overview: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'justify',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
