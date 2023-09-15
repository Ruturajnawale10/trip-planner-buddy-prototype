import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import BottomTabBar from './components/BottomTabBar';
import MapViewPage from './components/MapViewPage';

const AppNavigator = createStackNavigator(
);

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;