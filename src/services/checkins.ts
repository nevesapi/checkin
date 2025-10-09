import { supabase } from "../lib/supabase";

export async function getCheckins(userId: string) {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })
    .limit(5);

  if (error) throw error;

  console.log(`Ddos do checkin:`, data);

  return data;
}

export async function registerCheckin(
  userId: string,
  location?: { latitude: number; longitude: number }
) {
  const { data, error } = await supabase.from("checkins").insert([
    {
      user_id: userId,
      latitude: location?.latitude ?? null,
      longitude: location?.longitude ?? null,
    },
  ]);

  if (error) {
    console.log("erro de checkin: ", error.message);

    throw error;
  }
  console.log("dados do checkin:", data);

  return data;
}
