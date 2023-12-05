import React, { useState, Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import HomePage from "./components/HomePage/HomePage";
import SearchPage from "./components/SearchPage";
import ListPOIs from "./components/POIs/ListPOIs";
import POIs from "./components/POIs/POIs";
import CurrentTrip from "./components/POIs/CurrentTrip";
import ItineraryHome from "./components/POIs/ItineraryHome";
import PreferenceScreen1 from "./components/UserPreferences/PreferenceScreen1";
import PreferenceScreen2 from "./components/UserPreferences/PreferenceScreen2";
import ProfilePage from "./components/Profile/ProfilePage";
import EditProfile from "./components/Profile/EditProfile";
import UpcomingTrips from "./components/POIs/UpcomingTrips";
import PastTrips from "./components/POIs/PastTrips";
import SharedTrips from "./components/POIs/SharedTrips";
import PastItineraryHome from "./components/POIs/PastItineraryHome";
import { RecoilRoot } from "recoil";
import { LogBox } from "react-native";
import ChatBot from "./components/ChatBot/ChatBot";

// Ignore log notification by message:
LogBox.ignoreLogs(["Warning: ..."]);

// Ignore all log notifications:
LogBox.ignoreAllLogs();

const App = () => {
  const [isLogoLoading, setLogoLoading] = useState(false);
  // remove logo when map is loaded
  const logoLoaded = (bool) => {
    setLogoLoading(bool);
  };

  return (
    <RecoilRoot>
      <Suspense fallback={<ActivityIndicator />}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Suspense>
    </RecoilRoot>
  );
};

const AppNavigator = createAppContainer(
  createStackNavigator(
    {
      Login: LoginScreen,
      Signup: SignupScreen,
      HomePage: HomePage,
      SearchPage: SearchPage,
      ListPOIs: ListPOIs,
      POIs: POIs,
      CurrentTrip: CurrentTrip,
      ItineraryHome: ItineraryHome,
      PreferenceScreen1: PreferenceScreen1,
      PreferenceScreen2: PreferenceScreen2,
      ProfilePage: ProfilePage,
      EditProfile: EditProfile,
      UpcomingTrips: UpcomingTrips,
      PastTrips: PastTrips,
      SharedTrips: SharedTrips,
      PastItineraryHome: PastItineraryHome,
      ChatBot: ChatBot,
    },
    {
      initialRouteName: "Login",
      headerMode: "none",
    }
  )
);

export default App;
