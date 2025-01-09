import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AppStack, AuthStack} from './src/stack';
import {StatusBar} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import {persistor, store} from './src/utlis/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Loading} from './src/components';
import {StripeProvider} from '@stripe/stripe-react-native';
import {selectIsLoggedIn} from './src/features/auth/slices/auth.slice'; // Import the selector

const AppContent = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn); // Use the selector to get the login state

  return (
    <NavigationContainer>
      <StripeProvider publishableKey="pk_test_51NptlpCnjWVnOWMhRmG87tebKO8jTyibyjW5VHHQXWXKZnlboNJdb4wtTFlcXiRrB2zknzu1fqkkhNnU0tnzAEI900xZVtIHc4">
        <StatusBar
          barStyle="light-content"
          animated={true}
          backgroundColor="#6F3744"
        />
        {/* Check if user is logged in and navigate accordingly */}
        {isLoggedIn ? <AppStack /> : <AuthStack />}
      </StripeProvider>
    </NavigationContainer>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  // Simulate some startup loading like fetching persisted state
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
