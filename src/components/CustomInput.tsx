import { Controller } from "react-hook-form";
import { TextInput, TextInputProps, StyleSheet, Text, View } from "react-native";

type CustomInputProps = {
    control: any;
    name: string;
} & TextInputProps;

export default function CustomInput({control, name, ...props}: CustomInputProps){
    return (
        <Controller rules={{required: "This field is required"}} control={control} name={name} render={
        ({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                {...props}
                style={[styles.input, props.style]}
                placeholderTextColor={'#a1a1a1'}
            />
            <Text style={styles.error}>{error?.message} </Text>
          </View>
        )
      }/>
    );
}

const styles = StyleSheet.create({
    container:{
        gap: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#a1a1a1',
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: 'crimson',
    }
});

