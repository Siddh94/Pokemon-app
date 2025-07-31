import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export default function Favorites() {
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const pokemonData = await Promise.all(
          favoriteIds.map(async (id: number) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();
            return {
              id: data.id,
              name: data.name,
              image: data.sprites.other['official-artwork'].front_default,
              types: data.types.map((type: any) => type.type.name),
            };
          })
        );
        setFavoritePokemon(pokemonData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setLoading(false);
    }
  };

  const removeFavorite = async (pokemonId: number) => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const updatedFavorites = favoriteIds.filter((id: number) => id !== pokemonId);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavoritePokemon(prev => prev.filter(pokemon => pokemon.id !== pokemonId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const typeColors: { [key: string]: string } = {
      fire: '#FF6B47',
      water: '#4A90E2',
      grass: '#7ED321',
      electric: '#F5A623',
      psychic: '#BD10E0',
      ice: '#50E3C2',
      dragon: '#7B68EE',
      dark: '#2C2C54',
      fairy: '#FFB3BA',
      fighting: '#D0021B',
      poison: '#B013C4',
      ground: '#F8E71C',
      flying: '#87CEEB',
      bug: '#9ACD32',
      rock: '#8B4513',
      ghost: '#9C88FF',
      steel: '#B0C4DE',
      normal: '#A8A878',
    };
    return typeColors[type] || '#68A085';
  };

  const renderFavoriteCard = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity style={styles.card}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.pokemonId}>#{item.id.toString().padStart(3, '0')}</Text>
          <TouchableOpacity onPress={() => removeFavorite(item.id)}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <Image source={{ uri: item.image }} style={styles.pokemonImage} />
        
        <Text style={styles.pokemonName}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>
        
        <View style={styles.typesContainer}>
          {item.types.map((type, index) => (
            <View
              key={index}
              style={[styles.typeTag, { backgroundColor: getTypeColor(type) }]}
            >
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart size={64} color="#E5E7EB" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Add some Pokémon to your favorites by tapping the heart icon!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Pokémon</Text>
        {favoritePokemon.length > 0 && (
          <Text style={styles.subtitle}>
            {favoritePokemon.length} Pokémon in your collection
          </Text>
        )}
      </View>

      {favoritePokemon.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={favoritePokemon}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  pokemonId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  pokemonImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});