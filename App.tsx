import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomInput from './src/components/CustomInput';
import CustomBtn from './src/components/CustomBtn';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';



const signInSchema = z.object({
  email: z.string({message:"Email is required"}).email("Invalid email"),
  password: z.string({message: "Password is required"}).min(8, "Password must be at least 8 characters long"),
});

type signInFields = z.infer<typeof signInSchema>;




export default function App() {

  const {control, handleSubmit, formState:{errors}} = useForm({
    resolver: zodResolver(signInSchema),
  })

  console.log(errors)

  const onSignIn = (data: signInFields) => {
    console.log("Sign In:", data.email, data.password);
  }



  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

      <Text style={styles.title}>Sign In</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name='email'
          placeholder='Email'
          autoFocus
          keyboardType='email-address'
          autoComplete='email'
        />
        <CustomInput control={control} name='password' placeholder='Password' secureTextEntry/>
      </View>
      
      <CustomBtn onPress={handleSubmit(onSignIn)} text='Sign in' />


      <StatusBar style="auto" /> 
    </KeyboardAvoidingView>
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
  form:{
    gap: 10
  }
});
