import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import Constants from "expo-constants";

interface AppConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

// Pega as variáveis do app.config.ts em tempo de execução (do campo 'extra')
const { supabaseUrl, supabaseKey } = Constants?.expoConfig?.extra as AppConfig;

export const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

