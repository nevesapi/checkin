import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CustomAlertProps } from "../types";
import { Ionicons } from "@expo/vector-icons";

export default function CustomAlert({
  visible,
  title,
  message,
  onClose,
  type,
}: CustomAlertProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <View style={{ alignItems: "center", marginBottom: 15 }}>
            {type === "success" ? (
              <Ionicons name="checkmark-circle" size={32} color="#34D399" />
            ) : (
              <MaterialIcons name="error" size={32} color="#f12e2eff" />
            )}
          </View>
          <Text style={styles.alertTitle}>{title}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  alertContainer: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 8,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 16,
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 24,
  },
  alertButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  alertButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
