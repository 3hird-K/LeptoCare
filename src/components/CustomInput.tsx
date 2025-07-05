import { TextInput, TextInputProps } from "react-native";

type CustomInputProps = {
    // custom fields
} & TextInputProps;

export default function CustomInput(props: CustomInputProps){
    return <TextInput {...props} style={[styles.input, props.style]} />
}

const styles = {
    input: {
        borderWidth: 1,
        borderColor: '#676b68',
        padding: 10,
        borderRadius: 5,
        placeholderTextColor: '#676b68',
    },
};

