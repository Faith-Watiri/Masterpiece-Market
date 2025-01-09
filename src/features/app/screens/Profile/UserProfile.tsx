import {View, Text, Image, ScrollView, TouchableHighlight} from 'react-native';
import React from 'react';
import {AppLayout} from '../../components';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'; // Imported MaterialIcons
import FeatherIcon from 'react-native-vector-icons/Feather'; // Imported Feather
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Digital from '../../../../assets/digital.jpg';
import {useNavigation} from '@react-navigation/native';
import {PrimaryButton} from '../../../../components';
import LogoutIcon from 'react-native-vector-icons/SimpleLineIcons';
import {setSignOut, useUserAuth} from '../../../auth/slices/auth.slice';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux'; // Imported SimpleLineIcons for Logout

type RootStackParamList = {
  UserProfile: undefined;
  Account: undefined;
  Favorites: undefined;
  Collection: undefined;
  Orders: undefined;
  Cart: undefined;
  GiftCard: undefined;
  Chat: undefined;
  Settings: undefined;
};

type UserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserProfile'
>;

export function UserProfile() {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const {name, email, role} = useUserAuth();
  const dispatch = useDispatch();

  const settingsData = [
    {
      id: 1,
      name: 'Account',
      icon: 'user', // Feather icon
      iconType: 'Feather',
      route: 'Account',
    },
    {
      id: 2,
      name: 'Favorites',
      icon: 'heart', // Feather icon
      iconType: 'Feather',
      route: 'Favorites',
    },
    {
      id: 3,
      name: 'Collection',
      icon: 'collections-bookmark', // MaterialIcon
      iconType: 'Material',
      route: 'Collection',
    },
    {
      id: 4,
      name: 'Orders',
      icon: 'credit-card', // Feather icon
      iconType: 'Feather',
      route: 'Orders',
    },
    {
      id: 5,
      name: 'Cart',
      icon: 'shopping-cart', // Feather icon
      iconType: 'Feather',
      route: 'Cart',
    },
    {
      id: 6,
      name: 'Gift card',
      icon: 'gift', // Feather icon
      iconType: 'Feather',
      route: 'GiftCard',
    },
    {
      id: 7,
      name: 'Message',
      icon: 'message-square', // Feather icon
      iconType: 'Feather',
      route: 'Chat',
    },
    {
      id: 8,
      name: 'Settings',
      icon: 'settings', // Feather icon
      iconType: 'Feather',
      route: 'Settings',
    },
  ];

  return (
    <AppLayout>
      <View className="flex-row justify-between">
        <FeatherIcon name="arrow-left" size={24} color="black" />

        <View className="items-center space-y-3 mt-10">
          {/* {<Image source={Digital} className="h-14 w-14 rounded-full" />} */}
          <Text className="text-primary text-4xl font-bold">{name}</Text>
          <Text className="text-tertiary text-lg">{email}</Text>
          <Text className="text-tertiary text-lg">{role}</Text>

          {/*<View className="flex-row items-center justify-around">*/}
          {/*  <Text className="text-tertiary text-lg">USA</Text>*/}
          {/*</View>*/}
          <View className="flex-row space-x-10">
            <View className="items-center">
              <Text className="font-bold text-tertiary">120k</Text>
              <Text className="text-tertiary">followers</Text>
            </View>
            <View className="items-center">
              <Text className="font-bold text-tertiary">12</Text>
              <Text className="text-tertiary">following</Text>
            </View>
          </View>
        </View>

        <FeatherIcon name="share-2" size={24} color="black" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-5">
        {settingsData.map(item => (
          <View key={item.id} className="flex-row justify-between my-2">
            <View className="flex-row items-center">
              {item.iconType === 'Feather' ? (
                <FeatherIcon name={item.icon} size={24} color="black" />
              ) : (
                <MaterialIcon name={item.icon} size={24} color="black" />
              )}
              <Text className="text-tertiary text-lg ml-2">{item.name}</Text>
            </View>
            <TouchableHighlight
              onPress={() =>
                navigation.navigate(item.route as keyof RootStackParamList)
              }>
              <FeatherIcon name="chevron-right" size={24} color="black" />
            </TouchableHighlight>
          </View>
        ))}

        <View className="mt-4">
          {role === 'COLLECTOR' && (
            <PrimaryButton name="Become an Artist" onPress={() => {}} />
          )}
        </View>

        <TouchableHighlight
          className="my-2"
          onPress={async () => {
            // Remove only the access token, not the entire storage
            await AsyncStorage.clear();

            dispatch(setSignOut());
          }}>
          <View className="flex-row items-center justify-center mt-2">
            <LogoutIcon name="logout" size={24} color="black" />
            <Text className="text-center ml-2">Logout</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    </AppLayout>
  );
}
