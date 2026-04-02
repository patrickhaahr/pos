"use server";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "admin" && password === "admin") {
    const session = await getSession();
    session.isAdmin = true;
    await session.save();
    redirect("/admin");
  }

  return { error: "Invalid credentials" };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
