import 'react-native-gesture-handler';
import './i18n'
import { StyleSheet } from "react-native";
import RootNavigator from "./screens/Navigation/RootNavigator";
import { AuthProvider } from "./contextProviders/AuthContext";
import { ProfileProvider } from "./contextProviders/ProfileContext";

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
         <RootNavigator /> 
      </ProfileProvider>       
    </AuthProvider>
        
 
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    paddingHorizontal: "3%",
  },
  paragrapgh1: {
    paddingTop: "10%",
  },
});
