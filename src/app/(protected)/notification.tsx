import { View, Text, StyleSheet } from "react-native";

export default function Notification(){
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.paragraph}>You have no new notifications.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // gap: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold", 
        color: "#333",
    },
    paragraph: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});