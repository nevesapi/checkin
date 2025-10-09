import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signUp } from "../src/services/authUser";
import CustomAlert from "../src/components/CustomAlert";
import { showAlert } from "../src/lib/ui/alert";
import { isValidEmail } from "../src/utils/validators";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const router = useRouter();

  const handleRegister = async () => {
    if (name === "" || email === "" || password === "") {
      showAlert(
        setters,
        "Ooops!",
        "Todos os campos são obrigatórios.",
        "error"
      );
      return;
    }

    if (!isValidEmail(email)) {
      showAlert(
        setters,
        "E-mail inválido",
        "Por favor, insira um e-mail válido.",
        "error"
      );
      return;
    }

    if (password.length < 8) {
      showAlert(
        setters,
        "Senha inválida",
        "A senha deve ter pelo menos 8 caracteres.",
        "error"
      );
      return;
    }

    setLoading(true);

    const credentials = { name, email, password };
    try {
      await signUp(credentials);

      setTimeout(() => {
        router.push("/");
      }, 3000);
      showAlert(
        setters,
        "Sucesso",
        `Usuário cadastrado com sucesso. Confirme seu e-mail antes de fazer login!`,
        "success"
      );
      Vibration.vibrate(300);
    } catch (error: any) {
      console.log(`Erro ao tentar cadastrar: ${error.message}`);
      showAlert(setters, "Erro :/", `Erro ao tentar cadastrar!`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>CheckIn!</Text>
        <Text style={styles.subtitle}>Cadastre-se para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#9CA3AF"
          accessible
          accessibilityLabel="Nome completo"
        />

        <TextInput
          style={styles.input}
          placeholder="exemplo@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
          accessible
          accessibilityLabel="Seu E-mail"
        />

        <TextInput
          style={styles.input}
          placeholder="**********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          accessible
          accessibilityLabel="Sua senha"
        />

        <TouchableOpacity
          style={[styles.buttonPrimary, loading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <Link href="/" style={styles.secondaryText}>
          <Text>Já possui uma conta? Faça login</Text>
        </Link>
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
    padding: 20,
    backgroundColor: "#111827",
  },
  authContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#374151",
    color: "#F9FAFB",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  buttonPrimary: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#A5B4FC",
    textAlign: "center",
    marginTop: 20,
  },
});
