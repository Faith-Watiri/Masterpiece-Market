import {View, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import {FormInput} from '../../../components';
import {AuthLayout} from '../components';
import {BASE_URL} from '../../../lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {decode as atob} from 'base-64';
import {useDispatch} from 'react-redux';
import {setSignIn} from '../slices/auth.slice'; // Import the action

interface JwtPayload {
  userId: number;
  iat: number;
  exp: number;
}

// Helper function to decode JWT manually
const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // Initialize dispatch

  const fetchUserProfile = async (userId: number, token: string) => {
    try {
      const config = {
        url: `${BASE_URL}/users/${userId}`, // Fetch profile data using user ID
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      };

      const profileResponse = await axios(config); // Use axios directly here
      const profileData = profileResponse.data;

      // Save user profile data to AsyncStorage
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profileData));

      // Dispatch the user profile data to Redux, including userId
      dispatch(
        setSignIn({
          userId: profileData.id, // Set userId in the state
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
        }),
      );

      ToastAndroid.showWithGravityAndOffset(
        'User profile fetched successfully!',
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
        25,
        50,
      );
    } catch (error) {
      console.error('Error fetching user profile:', error);
      ToastAndroid.showWithGravityAndOffset(
        'Error fetching profile!',
        ToastAndroid.BOTTOM,
        ToastAndroid.LONG,
        25,
        50,
      );
    }
  };

  const onSubmit = async () => {
    const requestData = {email, password};

    const config = {
      url: `${BASE_URL}/auth/login`,
      method: 'POST',
      data: requestData,
    };

    try {
      const res = await axios(config); // Use axios here directly instead of axiosReq

      if (res.status === 201) {
        const {accessToken} = res.data;
        console.log('Login successful, token:', accessToken);

        // Save token to AsyncStorage
        await AsyncStorage.setItem('@access_token', accessToken);

        // Decode the token manually to get the userId
        const decodedToken = decodeJwt(accessToken);
        if (decodedToken) {
          const userId = decodedToken.userId;
          console.log('Decoded userId:', userId);

          // Save the userId to AsyncStorage as well (optional)
          await AsyncStorage.setItem('@user_id', userId.toString());

          // Fetch user profile using the user ID from the token
          await fetchUserProfile(userId, accessToken);

          ToastAndroid.showWithGravityAndOffset(
            'Logged in and user profile loaded successfully!',
            ToastAndroid.BOTTOM,
            ToastAndroid.LONG,
            25,
            50,
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Error decoding token',
            ToastAndroid.BOTTOM,
            ToastAndroid.LONG,
            25,
            50,
          );
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Invalid credentials',
          ToastAndroid.BOTTOM,
          ToastAndroid.LONG,
          25,
          50,
        );
      }
    } catch (error) {
      console.error('Login error:', error);
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
    <AuthLayout
      pageTitle="Login"
      accountCheck="Don't have an account?"
      screen="Register"
      action="Login"
      onPress={onSubmit}>
      <View>
        <FormInput
          label="Email Address"
          value={email}
          placeholder="johndoe@gmail.com"
          onChangeText={text => setEmail(text)}
          secureTextEntry={false}
        />
        <FormInput
          label="Password"
          value={password}
          placeholder="Enter your password"
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
    </AuthLayout>
  );
}
