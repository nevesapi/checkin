import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { getCheckins, registerCheckin } from "@/src/services/checkins";
import CustomAlert from "@/src/components/CustomAlert";
import { Checkin } from "@/src/types";
import { showAlert } from "@/src/lib/ui/alert";
import { formatDate } from "@/src/utils/formatters";

export default function Home() {
  const { name, id } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotifiation] = useState<boolean>(false);

  const handleNotification = () => {
    showAlert(
      setters,
      "Lembrete Diário Teste",
      "Lembrete diário desativado!",
      "success"
    );
  };

  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertType, setAlertType] = useState<"success" | "error">("error");
  const setters = {
    setVisible: setAlertVisible,
    setTitle: setAlertTitle,
    setMessage: setAlertMessage,
    setType: setAlertType,
  };

  const [checkIns, setCheckIns] = useState<Checkin[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchData = async () => {
    try {
      const data = await getCheckins(id as string);
      setCheckIns(data);
      console.log("info: ", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Erro ao buscar check-ins:", error);
    }
  };

  const handleCheckIn = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAlert(setters, "Permissão negada", "Localização não disponível.");
      }

      setLoading(true);
      const loc = await Location.getCurrentPositionAsync({});
      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;

      await registerCheckin(id as string, { latitude, longitude });
      setLocation({ latitude, longitude });
      fetchData();
      showAlert(
        setters,
        "Check-in realizado",
        "Check-in com localização salvo com sucesso!",
        "success"
      );
    } catch (error) {
      console.error("Erro no check-in:", error);
      showAlert(
        setters,
        "Erro",
        "Ocorreu um erro ao registrar o check-in.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registros recentes</Text>

          <FlatList
            style={styles.flatList}
            data={checkIns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.checkinItem}>
                <View>
                  <Text style={styles.checkinTitle}>Teste: Shopping Center Norte</Text>
                  <Text style={styles.checkinText}>
                    Teste: Av. Otto Burguer, 245 - Vila Guilherme
                  </Text>
                  <Text style={styles.checkinText}>
                    {formatDate(item.timestamp)}
                  </Text>
                  <Text style={styles.checkinText}>Lat: {item.latitude}</Text>
                  <Text style={styles.checkinText}>Lon: {item.longitude}</Text>
                </View>
                <Ionicons name="location-sharp" size={32} color="#6D28D9" />
              </View>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>
                Nenhum check-in registrado ainda.
              </Text>
            )}
          />
        </View>

        <TouchableOpacity
          style={[styles.buttonCheckIn, loading && { opacity: 0.6 }]}
          onPress={handleCheckIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonCheckInText}>
              Registrar Check-in Diário
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={handleNotification}
        >
          <FontAwesome6 name="bell" size={24} color="#ffffff" />
          <Text style={styles.buttonSecondaryText}>
            {notification
              ? "Lembrete Diário Ativado"
              : "Ativar Lembrete Diário"}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111827",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#111827",
  },
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    marginBottom: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  checkInTime: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 12,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 12,
    color: "#D1D5DB",
    marginLeft: 6,
  },
  buttonCheckIn: {
    backgroundColor: "#6D28D9",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonCheckInText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonSecondary: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#374151",
    borderRadius: 30,
  },
  buttonSecondaryText: {
    color: "#A5B4FC",
    fontSize: 16,
    marginLeft: 8,
  },
  flatList: {
    maxHeight: 300,
    width: "100%",
  },
  checkinItem: {
    marginBottom: 15,
    backgroundColor: "#374151",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkinTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkinText: {
    color: "#fff",
  },
  emptyListText: {
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
  },
});
