import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/infrastucture/login/login';
import IncomingControl from './src/domains/projectile-and-mine-120/forms/incoming-control';
import TotalBodyWeight from './src/domains/projectile-and-mine-120/forms/total-body-weight';
import DdWeight from './src/domains/projectile-and-mine-120/forms/dd-weight';
import CurbWeight from './src/domains/projectile-and-mine-120/forms/curb-weight';
import Main from './src/infrastucture/scanner/main';
import ProductDeatils from './src/domains/projectile-and-mine-120/forms/product-details';
import EliminationOfDefect from './src/domains/projectile-and-mine-120/forms/elimination-of-defect';
import IncomingControl122 from './src/domains/projectile-and-mine-122/forms/incoming-control';
import TotalBodyWeight122 from './src/domains/projectile-and-mine-122/forms/total-body-weight';
import DdWeight122 from './src/domains/projectile-and-mine-122/forms/dd-weight';
import CurbWeight122 from './src/domains/projectile-and-mine-122/forms/curb-weight';
import ProductDeatils122 from './src/domains/projectile-and-mine-122/forms/product-details';
import EliminationOfDefect122 from './src/domains/projectile-and-mine-122/forms/elimination-of-defect';
import {WithSplashScreen} from './SplashScreen';
import {Header} from './src/ui/components/header/header';
import {ROUTES} from './src/const/routes';

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
          <Stack.Screen
            name={ROUTES.IncomingControl122}
            component={IncomingControl122}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.TotalBodyWeight122}
            component={TotalBodyWeight122}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.DdWeight122}
            component={DdWeight122}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.CurbWeight122}
            component={CurbWeight122}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.ProductDeatils122}
            component={ProductDeatils122}
            options={headerStyles}
          />
          <Stack.Screen
            name={ROUTES.EliminationOfDefect122}
            component={EliminationOfDefect122}
            options={headerStyles}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </WithSplashScreen>
  );
};

export default App;