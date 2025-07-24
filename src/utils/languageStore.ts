import * as SecureStore from 'expo-secure-store';

const LANGUAGE_KEY_PREFIX = 'user_language'; // use _ instead of -

export const saveLanguageToMetadata = async (lang: string, userId: string) => {
  try {
    const key = `${LANGUAGE_KEY_PREFIX}_${userId}`; // ✅ use underscore
    await SecureStore.setItemAsync(key, lang);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
};

export const getSavedLanguage = async (userId: string): Promise<string | null> => {
  try {
    const key = `${LANGUAGE_KEY_PREFIX}_${userId}`; // ✅ use underscore
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};
