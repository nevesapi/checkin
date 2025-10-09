import { supabase } from "../lib/supabase";
import { LoginCredentials, RegisterCredentials } from "../types";

export async function signUp({ name, email, password }: RegisterCredentials) {
  const { data: dataUser, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.log("authError message:", authError.message);
    console.log("authError code:", authError.code);
    throw authError;
  }

  if (!dataUser?.user?.id) {
    throw new Error("Falha ao gerar ID do usuário.");
  }

  const { data, error: dbError } = await supabase.from("users").insert([
    {
      id: dataUser.user?.id,
      full_name: name,
    },
  ]);

  if (dbError) {
    throw new Error(`Erro ao inserir nome de usuário: ${dbError.message}`);
  }

  console.log("Usuário cadastrado com sucesso!");
  return data;
}

export async function signIn({ email, password }: LoginCredentials) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    console.log("authError message:", authError.message);
    console.log("authError code:", authError.code);

    throw authError;
  }

  const userId = authData?.user?.id;

  if (!userId) {
    throw new Error("Falha ao buscar ID do usuário para login.");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("erro ao uscar usuário:", userError.message);
    throw userError;
  }

  return {
    user: authData.user,
    session: authData.session,
    profile: userData,
  };
}
