import 'react-native-gesture-handler';
import React, {Component, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';
import HomeScreen from './components/screens/HomeScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import TestScreen from './components/screens/TestScreen';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
import TermsScreen from './components/screens/TermsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import QuizHTTP from './assets/QuizHTTP';
import _ from 'lodash';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

const CustomDrawer = props => {
  return (
    <View style={styles.app}>
      <View style={styles.header}>
        <Text>Quiz App</Text>
        <View style={styles.sizedBox} />
        <Button onPress={fetchAllDatabase} title={'Download database'} />
        <View style={styles.sizedBox} />
        <Button onPress={() => getRandomTest(props)} title={'Random test'} />
        <View style={styles.sizedBox} />
      </View>
      <DrawerItemList {...props} />
    </View>
  );
};

const sleep = async milliseconds => {
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds);
  });
};

const fetchAllDatabase = async () => {
  Toast.show({text1: 'Downloading the database', visibilityTime: 2000});
  const results = await QuizHTTP.getResults();
  const tests = await QuizHTTP.getAllTests();
  let testsDetails = {};
  for (let i = 0; i < tests.length; i++) {
    testsDetails[tests[i].id] = await QuizHTTP.getTestDetails(tests[i].id);
  }
  console.log(testsDetails);
  await sleep(2000);
  Toast.show({text1: 'Database has been downloaded', visibilityTime: 2000});
};

const getRandomTest = async props => {
  const test = await fetchRandomTests();
  props.navigation.navigate('Test', {item: test});
};

const fetchRandomTests = async () => {
  const result = await QuizHTTP.getAllTests();
  return _.shuffle(result)[0];
};

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Results" component={ResultsScreen} />
      <Drawer.Screen name="Terms" component={TermsScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [isConnectedToNetwork, setIsConnectedToNetwork] = useState(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const setUpInitial = async () => {
      await loadResourcesAsync();
      await fetchAllDatabase();
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected !== isConnectedToNetwork) {
          setIsConnectedToNetwork(state.isConnected);
          if (!state.isConnected) {
            Toast.show({
              text1: 'No network connection',
              visibilityTime: 2000,
              position: 'bottom',
            });
          } else {
            Toast.show({
              text1: 'Connected to network',
              visibilityTime: 2000,
              position: 'bottom',
            });
          }
        }
      });
    };
    setUpInitial();
  }, []);

  async function loadResourcesAsync() {
    setLoadingComplete(true);
  }

  const getInitialPage = async () => {
    const showTerms = await AsyncStorage.getItem('terms');
    if (showTerms) return 'Terms';
    return 'Home';
  };

  if (!isLoadingComplete) {
    return <Text>Loading</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={DrawerNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home Page" component={HomeScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  app: {
    fontFamily: 'OpenSans',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 80,
    width: 80,
  },
  sizedBox: {
    height: 20,
  },
});
