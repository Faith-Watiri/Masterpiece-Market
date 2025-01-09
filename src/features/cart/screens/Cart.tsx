/* eslint-disable react-native/no-inline-styles */
import {Image, ScrollView, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCart,
} from '../slices/cart.slice';
import {AppLayout} from '../../app/components';
import Icon from 'react-native-vector-icons/Feather';
import Bin from 'react-native-vector-icons/MaterialIcons';
import {PrimaryButton} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';

type CartItemProps = {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
};

type RootStackParamList = {
  Cart: undefined;
  Payment: {totalPrice: number; artIds: number[]};
};

function CartItem({id, image, name, price, quantity = 0}: CartItemProps) {
  const dispatch = useDispatch();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        marginBottom: 10,
      }}>
      {/* Left Section: Image */}
      <Image
        source={{uri: image}}
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          marginRight: 10,
          borderWidth: 1,
        }}
      />

      {/* Middle Section: Name and Price */}
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#333'}}>
          {name}
        </Text>
        <Text style={{fontSize: 14, color: '#666'}}>KES {price}</Text>
      </View>

      {/* Right Section: Quantity and Actions */}
      <View style={{alignItems: 'center'}}>
        {/* Quantity Controls */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight onPress={() => dispatch(incrementQuantity(id))}>
            <Icon name="plus-circle" size={24} color="black" />
          </TouchableHighlight>
          <Text style={{marginHorizontal: 10, fontSize: 16}}>{quantity}</Text>
          <TouchableHighlight onPress={() => dispatch(decrementQuantity(id))}>
            <Icon name="minus-circle" size={24} color="black" />
          </TouchableHighlight>
        </View>

        {/* Remove Button */}
        <TouchableHighlight onPress={() => dispatch(removeFromCart(id))}>
          <Bin
            name="delete-outline"
            size={24}
            color="black"
            style={{marginTop: 10}}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
}

export function Cart() {
  const cart = useSelector(selectCart);

  console.log(cart);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getTotal = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((item: {quantity: number; price: number}) => {
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price;
    });

    return {totalQuantity, totalPrice};
  };

  const {totalQuantity, totalPrice} = getTotal();

  return (
    <AppLayout>
      <View className="flex-row justify-between">
        <TouchableHighlight
          onPress={() => navigation.goBack()}
          className="rounded-full p-1">
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableHighlight>
        <Text className="text-tertiary text-center text-xl font-bold flex-1">
          Shopping Basket
        </Text>
      </View>

      <ScrollView className="py-4">
        {cart?.map((item: any) => (
          <CartItem
            key={item.id}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
          />
        ))}
      </ScrollView>
      <View className="absolute bottom-[50px] px-4">
        <Text className="text-primary text-lg uppercase">Order Summary</Text>

        <View className="mb-2 flex-row items-center space-x-2">
          <Text className="text-tertiary text-center  ">
            total ({totalQuantity} items):
          </Text>
          <Text className="text-tertiary text-center text-lg font-bold">
            <Text className="">KES</Text> {totalPrice}
          </Text>
        </View>

        {totalQuantity > 0 ? (
          <PrimaryButton
            name={`Checkout (KES ${totalPrice})`}
            onPress={() =>
              navigation.navigate('Payment', {
                totalPrice,
                artIds: cart.map((item: {id: number}) => item.id),
              })
            }
          />
        ) : (
          <Text className="text-tertiary text-center text-lg font-bold">
            Your cart is empty
          </Text>
        )}
      </View>
    </AppLayout>
  );
}
