import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import {PrimaryButton} from '../../../components';
import {BASE_URL} from '../../../lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loading} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../cart/slices/cart.slice';

type RootStackParamList = {
  Home: undefined;
  Payment: {totalPrice: number; artIds: number[]};
};

interface PaymentScreenRouteParams {
  route: {
    params: {
      totalPrice: number;
      artIds: number[];
    };
  };
}

export function PaymentScreen({route}: PaymentScreenRouteParams) {
  const {totalPrice, artIds} = route.params;
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const dispatch = useDispatch();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchPaymentSheetParams = useCallback(async () => {
    console.log('Fetching payment sheet parameters...');
    try {
      const token = await AsyncStorage.getItem('@access_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const payload = {
        amount: totalPrice * 100,
        currency: 'kes',
        artIds: artIds.map(id => Number(id)),
      };

      console.log('Payload:', payload);

      const response = await fetch(`${BASE_URL}/payment-sheets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend Error:', data);
        throw new Error(data.message || 'Failed to fetch payment intent');
      }

      console.log('Received payment sheet params:', data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching payment sheet params:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
      return null;
    }
  }, [totalPrice, artIds]);

  const initializePaymentSheet = useCallback(async () => {
    console.log('Initializing PaymentSheet...');
    setLoading(true);
    const paymentSheetParams = await fetchPaymentSheetParams();

    if (!paymentSheetParams) {
      setLoading(false);
      return;
    }

    const {paymentIntent, ephemeralKey, customer} = paymentSheetParams;

    try {
      const {error} = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Your Business Name',
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        console.error('Error initializing PaymentSheet:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.log('PaymentSheet initialized successfully.');
        setIsInitialized(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error during PaymentSheet setup:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchPaymentSheetParams, initPaymentSheet]);

  const sendReceipt = async () => {
    console.log('Sending receipt...');
    try {
      const token = await AsyncStorage.getItem('@access_token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      // Fetch full art details based on artIds
      const artDetailsResponse = await fetch(`${BASE_URL}/art/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({artIds}),
      });

      const artDetails = await artDetailsResponse.json();

      if (!artDetailsResponse.ok) {
        console.error('Error fetching art details:', artDetails);
        throw new Error(artDetails.message || 'Failed to fetch art details');
      }

      // Prepare payload for the receipt
      const payload = {
        amount: totalPrice * 100, // Convert to cents if needed
        currency: 'kes',
        artDetails, // Send full art details
      };

      const response = await fetch(`${BASE_URL}/payment-sheets/send-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend Error:', data);
        throw new Error(data.message || 'Failed to send receipt');
      }

      console.log('Receipt sent successfully:', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending receipt:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [initializePaymentSheet]);

  const openPaymentSheet = async () => {
    console.log('Presenting PaymentSheet...');
    try {
      const {error} = await presentPaymentSheet();

      if (error) {
        console.error('Error presenting PaymentSheet:', error.message);
        Alert.alert('Payment Error', error.message);
      } else {
        console.log('Payment completed successfully.');
        await sendReceipt(); // Send receipt after payment is confirmed
        dispatch(clearCart()); // Clear cart
        Alert.alert('Success', 'Your payment was confirmed!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'), // Navigate to Home
          },
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error during payment presentation:', error.message);
        Alert.alert('Error', error.message);
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  if (!isInitialized || loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <Text style={styles.subtitle}>Total Price: KES {totalPrice}</Text>

      <PrimaryButton
        name={`Pay KES ${totalPrice}`}
        onPress={openPaymentSheet}
        disabled={!isInitialized}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
});
