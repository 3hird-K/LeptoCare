import { Controller,Control, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps, StyleSheet, Text, View } from "react-native";

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    rightElement?: React.ReactNode;
    inputStyle?: TextInputProps['style'];
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({control, name, rightElement, inputStyle, ...props}: CustomInputProps<T>){
    return (

        <Controller rules={{required: "This field is required"}} control={control} name={name} render={
        ({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                {...props}
                style={[styles.input, props.style, inputStyle, error ? {borderColor: 'crimson'} : {}]}
                placeholderTextColor={'#a1a1a1'}

            />
            {rightElement ? rightElement : null}

            
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
        borderRadius: 25,
        outlineColor: '#a1a1a1',
    },
    error: {
        color: 'crimson',
    }
});

