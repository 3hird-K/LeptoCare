import { StatusBar } from 'expo-status-bar';
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from './src/components/CustomInput';
import CustomBtn from './src/components/CustomBtn';

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign In</Text>

      <CustomInput
        placeholder='Email'
        autoFocus
        keyboardType='email-address'
        autoComplete='email'
      />
      <CustomInput placeholder='Password' secureTextEntry/>
      <CustomBtn onPress={() => console.log("Signing In...")} text='Sign in' />


      <StatusBar style="auto" /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  // button:{
  //   backgroundColor: '#0a1282',
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   cursor: 'pointer',
  //   paddingBlock: 12,
  // }
  // ,
  // buttonText: {
  //   color: '#fff',
  //   fontSize: 16,
  // }

});
