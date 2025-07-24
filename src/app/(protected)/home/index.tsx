import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import CustomBtn from "@/components/CustomBtn";
import { useTranslation } from 'react-i18next';
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from "@/components/ScreenWrapper";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [awarenessRead, setAwarenessRead] = useState(false);
  const [preventionRead, setPreventionRead] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkReadStatuses = async () => {
        if (user) {
          const awarenessKey = `awareness_read_${user.id}`;
          const preventionKey = `prevention_read_${user.id}`;
          const awarenessValue = await AsyncStorage.getItem(awarenessKey);
          const preventionValue = await AsyncStorage.getItem(preventionKey);
          setAwarenessRead(awarenessValue === 'true');
          setPreventionRead(preventionValue === 'true');
        }
      };
      checkReadStatuses();
    }, [user])
  );

  const toggleAwareness = async () => {
    if (user) {
      const key = `awareness_read_${user.id}`;
      const newValue = !awarenessRead;
      await AsyncStorage.setItem(key, newValue.toString());
      setAwarenessRead(newValue);
    }
  };

  const togglePrevention = async () => {
    if (user) {
      const key = `prevention_read_${user.id}`;
      const newValue = !preventionRead;
      await AsyncStorage.setItem(key, newValue.toString());
      setPreventionRead(newValue);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>
          Hi, {user?.username || user?.firstName || 'User'}!
        </Text>
        <Text style={styles.header}>{t('welcome')}</Text>
        <Text style={styles.subtitle}>{t('guide')}</Text>

        {/* Awareness Card */}
        <View style={[styles.card, { backgroundColor: "#bcdfffff" }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.tag, { backgroundColor: "#D0F0E0", color: "#1C7860" }]}>
              {t('reading')}
            </Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {awarenessRead ? 'Marked as Read' : 'Mark as Read'}
              </Text>
              <Switch value={awarenessRead} onValueChange={toggleAwareness} />
            </View>
          </View>
          <Text style={styles.cardTitle}>{t('awareness')}</Text>
          <Text style={styles.cardSubtitle}>{t('learn')}</Text>
          <Image
            source={require("@assets/icons/ribbon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <CustomBtn
            text={awarenessRead ? t('reviewed') : t('review')}
            onPress={() => {
              router.push('/home/awareness');
            }}
          />
        </View>

        {/* Prevention Card */}
        <View style={[styles.card, { backgroundColor: "#ffc7c7ff" }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.tag, { backgroundColor: "#F9DADA", color: "#D43C3C" }]}>
              {t('reading')}
            </Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {preventionRead ? 'Marked as Read' : 'Mark as Read'}
              </Text>
              <Switch value={preventionRead} onValueChange={togglePrevention} />
            </View>
          </View>
          <Text style={styles.cardTitle}>{t('prevention')}</Text>
          <Text style={styles.cardSubtitle}>{t('preventionMethod')}</Text>
          <Image
            source={require("@assets/icons/shield.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <CustomBtn text={preventionRead ? t('reviewed') : t('review')} onPress={() => {}} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    marginTop: -5,
    textAlign: "center",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  switchLabel: {
    fontSize: 14,
    marginRight: 4,
    color: "#333",
  },
  tag: {
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  icon: {
    width: 60,
    height: 60,
    alignSelf: "flex-end",
    marginBottom: 12,
  },
});
