import { redirect } from "react-router-dom";
import SocialAuthUsingParticle from "./SocialAuthUsingParticle";

export async function getAddress() {
  const address = localStorage.getItem("address");
  return address;
}
export async function tokenLoader() {
  return getAddress();
}

export function LoginPage() {
  return <SocialAuthUsingParticle />;
}
export async function action() {
  const add = getAddress;
  if (add != null && add.length > 0) {
    console.log("Working");
    redirect("/");
  }
}
