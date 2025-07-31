import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Pokemon {
  id: number;
  name: string;
  url: string;
  image: string;
  types: string[];
}

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchPokemon();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterPokemon();
  }, [searchQuery, pokemon]);

  const fetchPokemon = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      
      const pokemonWithDetails = await Promise.all(
        data.results.map(async (poke: any, index: number) => {
          const details = await fetch(poke.url).then(res => res.json());
          return {
            id: details.id,
            name: poke.name,
            url: poke.url,
            image: details.sprites.other['official-artwork'].front_default,
            types: details.types.map((type: any) => type.type.name),
          };
        })
      );

      setPokemon(pokemonWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (pokemonId: number) => {
    const updatedFavorites = favorites.includes(pokemonId)
      ? favorites.filter(id => id !== pokemonId)
      : [...favorites, pokemonId];
    
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const filterPokemon = () => {
    if (searchQuery.trim() === '') {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(poke =>
        poke.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPokemon(filtered);
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

  const renderPokemonCard = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity style={styles.card}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.pokemonId}>#{item.id.toString().padStart(3, '0')}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Heart
              size={24}
              color={favorites.includes(item.id) ? '#FF6B6B' : '#9CA3AF'}
              fill={favorites.includes(item.id) ? '#FF6B6B' : 'transparent'}
            />
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={filteredPokemon}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1F2937',
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
});