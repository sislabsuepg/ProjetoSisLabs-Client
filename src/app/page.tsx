import { redirect } from "next/navigation";
import { useCookies } from "react-cookie";

export default function Page() {
  const [cookies] = useCookies(["usuario"]);
  if (!cookies.usuario) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
