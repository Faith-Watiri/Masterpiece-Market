/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList, Text, TouchableHighlight, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppLayout} from '../../components';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
import {Loading} from '../../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setSignOut, useUserAuth} from '../../../auth/slices/auth.slice';
import {BASE_URL} from '../../../../lib/constants';
import ArtCard from '../../../../components/Elements/Cards/ArtCard';
import {ArtItem} from '../Home';
import {StackNavigationProp} from '@react-navigation/stack';
import LogoutIcon from 'react-native-vector-icons/AntDesign';

type RootStackParamList = {
  Cart: undefined;
  Art: {data: ArtItem};
};

type ArtProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Art'
>;

export function ProfileScreen() {
  const {name, email, userId} = useUserAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation<ArtProfileScreenNavigationProp>();
  const [art, setArt] = useState<ArtItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    dispatch(setSignOut());
  };

  const getInitials = (user_name: string) => {
    const nameParts = user_name.split(' ');
    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];
    } else {
      return nameParts[0][0];
    }
  };

  // Fetch user's art
  const getUserArt = async (token: string) => {
    const url = `${BASE_URL}/art/user/${userId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user art: ${response.statusText}`);
      }

      const data = await response.json();
      setArt(data);
    } catch (error) {
      console.log('Error fetching user art:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch token and user's art on component mount
  useEffect(() => {
    const fetchTokenAndArt = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@access_token');
        if (storedToken) {
          await getUserArt(storedToken);
        } else {
          console.log('No token found in AsyncStorage');
        }
      } catch (error) {
        console.log('Error fetching token or user art:', error);
      }
    };

    fetchTokenAndArt();
  }, [getUserArt, userId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AppLayout>
      {/* Top header */}
      <View className="flex-row justify-between">
        <Icon
          name="arrow-left"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
        />
        <TouchableHighlight onPress={handleLogout}>
          <LogoutIcon name="logout" size={24} color="black" />
        </TouchableHighlight>
      </View>

      <View className="items-center space-y-3">
        <View
          style={{
            height: 56,
            width: 56,
            borderRadius: 28,
            backgroundColor: '#6F3744', // Use your desired background color
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>
            {getInitials(name)}
          </Text>
        </View>
        <Text className="text-primary text-[24px] font-bold">{name}</Text>
        <Text className="text-tertiary text-[14px]">{email}</Text>

        <View className="flex-row items-center justify-evenly w-2/3 h-auto">
          <Icon2 name="location" color="#C9C9C9" size={20} />
          <Text className="text-[#C9C9C9] text-sm">USA</Text>
          <Text className="text-[#C9C9C9] text-sm">b.1970</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-evenly my-2">
        <View className="items-center">
          <Text className="text-tertiary font-bold text-lg">150</Text>
          <Text className="text-tertiary text-xs">works</Text>
        </View>
        <View className="items-center">
          <Text className="text-tertiary font-bold text-lg">120</Text>
          <Text className="text-tertiary text-xs">followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-tertiary font-bold text-lg">15</Text>
          <Text className="text-tertiary text-xs">following</Text>
        </View>
      </View>

      {/* Bio Section */}
      <View className="items-center my-5 w-full">
        <Text className="text-tertiary text-center w-3/4">
          A passionate farce in Conceptual art John Doe transformed popp
          cultural and art historical oconography into ...
        </Text>
      </View>

      {/* Follow and Message Buttons */}
      {/*<View className="flex-row justify-around my-5" style={{width: '100%'}}>*/}
      {/*  <PrimaryButton name="Follow" onPress={() => {}} width={150} />*/}
      {/*  <SecondaryButton name="Message" onPress={() => {}} width={150} />*/}
      {/*</View>*/}

      {/* Artworks Section */}
      <View className="flex-row mt-5 items-center justify-between">
        <Text className="text-tertiary text-[25px] font-semibold">
          Artworks
        </Text>
        <Text className="text-tertiary text-[16px] items-center justify-center">
          <Icon name="filter" size={24} color={'black'} />
          Filters
        </Text>
      </View>

      {/* Render User's Artworks */}
      <FlatList
        data={art}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{gap: 8}} // Adjust the spacing
        renderItem={({item}: {item: ArtItem}) => (
          <ArtCard
            name={item.art_name}
            artist={name}
            price={item.price}
            image={item.image}
            onPress={() => navigation.navigate('Art', {data: item})}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 0,
          paddingBottom: 150,
        }} // Optional padding for overall list
      />
    </AppLayout>
  );
}
