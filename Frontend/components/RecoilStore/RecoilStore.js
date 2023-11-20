import { DefaultValue, atom } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userName = atom({
  key: "username",
  default: AsyncStorage.getItem("username"),
});

const userPreferences = atom({
  key: "userPreferences",
  default: new DefaultValue(),
});

export { userName, userPreferences };
