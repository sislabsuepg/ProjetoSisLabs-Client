import { redirect } from "next/navigation";

export default function Page() {
  // Always redirect to login on server side
  // Authentication logic should be handled in the login component
  redirect("/login");
}
