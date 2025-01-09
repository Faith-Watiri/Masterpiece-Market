/* eslint-disable react-native/no-inline-styles */
import {
  Dimensions,
  ImageBackground,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../../features/cart/slices/cart.slice';
import {addToFavorites} from '../../../features/app/screens/Art/slices/favorites.slice';

type ArtCardProps = {
  id: number;
  name: string;
  price?: number;
  image: string;
  artist: string;
  onPress?: () => void;
};

export default function ArtCard({
  id,
  name,
  price,
  image,
  artist,
  onPress,
}: ArtCardProps) {
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth / 2 - 28;
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const cartItem = {
      id, // Use the actual id
      name,
      price,
      image,
      artist,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    ToastAndroid.showWithGravityAndOffset(
      'Added to cart successfully!',
      ToastAndroid.BOTTOM,
      ToastAndroid.LONG,
      25,
      50,
    );
  };

  const handleAddToFavorites = () => {
    const favoriteItem = {
      id, // Use the actual id
      name,
      photo: image,
    };

    dispatch(addToFavorites(favoriteItem));

    ToastAndroid.showWithGravityAndOffset(
      'Added to favorites!',
      ToastAndroid.BOTTOM,
      ToastAndroid.LONG,
      25,
      50,
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginBottom: 0, width: cardWidth}}>
      {/* Image with Blur and Black Overlay */}
      <ImageBackground
        source={{uri: image}}
        style={{
          height: 180,
          width: '100%',
          borderRadius: 8,
          overflow: 'hidden',
        }}
        blurRadius={1}>
        {/* Black overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 10,
          }}
        />

        <View
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            flexDirection: 'row',
            gap: 10,
            zIndex: 20,
          }}>
          {/* Dispatch addToFavorites when heart icon is pressed */}
          <TouchableOpacity
            onPress={handleAddToFavorites}
            style={{padding: 6, backgroundColor: 'white', borderRadius: 20}}>
            <Icon name="heart" size={14} color="#6F3744" />
          </TouchableOpacity>

          {/* Dispatch addToCart when shopping-cart icon is pressed */}
          <TouchableOpacity
            onPress={handleAddToCart}
            style={{padding: 6, backgroundColor: 'white', borderRadius: 20}}>
            <Icon name="shopping-cart" size={14} color="#6F3744" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Text Section */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 10,
        }}>
        <View>
          <Text style={{color: '#6F3744', fontWeight: 'bold', fontSize: 16}}>
            {name}
          </Text>
          {artist && (
            <Text style={{color: '#6F3744', fontSize: 12}}>{artist}</Text>
          )}
          {price && (
            <Text style={{color: '#6F3744', fontWeight: '600', fontSize: 13}}>
              KES {price}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
