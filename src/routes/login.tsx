import { createFileRoute } from "@tanstack/react-router";
import { TeacherLogin } from "@/components/pedagogico/teacher-login";

export const Route = createFileRoute("/login")({
  component: TeacherLogin,
});
