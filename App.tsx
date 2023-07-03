import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/infrastucture/login/login';
import IncomingControl from './src/domains/projectile-and-mine/forms/incoming-control';
import TotalBodyWeight from './src/domains/projectile-and-mine/forms/total-body-weight';
import DdWeight from './src/domains/projectile-and-mine/forms/dd-weight';
import CurbWeight from './src/domains/projectile-and-mine/forms/curb-weight';
import Main from './src/infrastucture/scanner/main';
import ProductDeatils from './src/domains/projectile-and-mine/forms/product-details';
import EliminationOfDefect from './src/domains/projectile-and-mine/forms/elimination-of-defect';
import {WithSplashScreen} from './SplashScreen';
import {Header} from './src/ui/components/header/header';
import { ROUTES } from './src/const/routes';

const App = () => {
  const Stack = createStackNavigator();
  const headerStyles = {
    headerShown: true,
    headerStyle: {
      backgroundColor: '#44454F',
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
  };

  return (
    <WithSplashScreen isAppReady={true}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{cardStyle: {backgroundColor: '#242528'}}}>
          <Stack.Screen
            name={ROUTES.Login}
            component={Login}
            options={{
              headerShown: false,
              cardStyle: {backgroundColor: '#242528'},
            }}
          />
          <Stack.Screen
            name={ROUTES.IncomingControl}
            component={IncomingControl}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.TotalBodyWeight}
            component={TotalBodyWeight}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.DdWeight}
            component={DdWeight}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.CurbWeight}
            component={CurbWeight}
            options={headerStyles}
          />
          <Stack.Screen
            screenOptions={{header: Header}}
            name={ROUTES.Main}
            component={Main}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.ProductDeatils}
            component={ProductDeatils}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.EliminationOfDefect}
            component={EliminationOfDefect}
            options={headerStyles}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WithSplashScreen>
  );
};

export default App;
