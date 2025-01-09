/* eslint-disable react-native/no-inline-styles */
import {Image, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AppLayout} from '../../components';
import {PrimaryButton} from '../../../../components';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../../cart/slices/cart.slice';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Cart: undefined;
  SingleArt: {data: any};
};

type SingleArtScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SingleArt'
>;

type SingleArtProps = {
  route: {
    params: {
      data: {
        id: number;
        name: string;
        price: number;
        image: string;
        userId: number;
        category: string;
        size: string;
      };
    };
  };
};

export function SingleArt({route}: SingleArtProps) {
  const item = route.params.data;

  const navigation = useNavigation<SingleArtScreenNavigationProp>();
  const dispatch = useDispatch();

  // Determine the artist text before rendering
  const artistText = item.userId
    ? `Artist ID: ${item.userId}`
    : 'Artist: Unknown';

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        artist: artistText,
        quantity: 1,
      };

      dispatch(addToCart(cartItem));

      // Navigate to Cart screen after adding
      navigation.navigate('Cart');

      // Show success message
      ToastAndroid.showWithGravityAndOffset(
        'Added to cart successfully!',
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
        25,
        50,
      );
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred';
      ToastAndroid.showWithGravityAndOffset(
        errorMessage,
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
        25,
        50,
      );
    }
  };

  return (
    <AppLayout>
      {/* Header Icons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon2 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="menu" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Artwork Image */}
      <View style={{position: 'relative'}}>
        <Image
          style={{height: 240, borderRadius: 10}}
          source={{uri: item.image}} // Ensure the image URL is valid
          resizeMode="cover" // Prevents distortion of the image
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            padding: 5,
            borderRadius: 50,
            right: 10,
            top: 10,
          }}>
          <Icon name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Artwork Details */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignItems: 'center',
          marginVertical: 20,
        }}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '600', color: '#333'}}>
            {item.art_name}
          </Text>
          <Text style={{fontSize: 12, fontWeight: '600', color: '#333'}}>
            {artistText}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{color: '#333', fontSize: 12, fontWeight: '600'}}>
            <Text style={{fontWeight: '300'}}>Category: </Text>
            {item.category}
          </Text>
          <Text style={{color: '#333', fontSize: 12, fontWeight: '600'}}>
            <Text style={{fontWeight: '300'}}>Size: </Text>
            {item.size}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#333', fontSize: 12, fontWeight: '600'}}>
              Shipped in a Tube{' '}
            </Text>
            <Icon name="info-with-circle" size={12} color="black" />
          </View>
          <Text style={{fontSize: 18, fontWeight: '600', color: '#333'}}>
            <Text style={{fontWeight: '300', fontSize: 12}}>KES</Text>{' '}
            {item.price}
          </Text>
        </View>
      </View>

      {/* Add to Cart Button */}
      <PrimaryButton
        name="Add to Cart"
        onPress={handleAddToCart}
        width="100%" // Set width to default or customize
      />

      {/* Additional Information */}
      <View style={{padding: 20}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
          <Icon name="check" size={18} color="green" />
          <Text style={{fontSize: 12, color: '#333', marginLeft: 5}}>
            Shipping included
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="check" size={18} color="green" />
          <Text style={{fontSize: 12, color: '#333', marginLeft: 5}}>
            7 day money-back guarantee{' '}
          </Text>
          <Icon name="info-with-circle" size={12} color="black" />
        </View>
      </View>
    </AppLayout>
  );
}
