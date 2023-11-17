import AsyncStorage from "@react-native-async-storage/async-storage";
import { DefaultValue, atom } from "recoil";

const userName = atom({
  key: "username",
  default: "roshan",
});

const userPreferences = atom({
  key: "userPreferences",
  default: new DefaultValue(),
});

export { userName, userPreferences };
