import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,SafeAreaView} from 'react-native';
import Main from './src/Main';

export default function App() {
  return (
    <>
      <StatusBar />
      //importหน้าMainเป็นหน้าเเรกเมื่อเปิด App.js
      <Main/>
    </>
  );
}
