import { createFileRoute } from "@tanstack/react-router";
import { PedagogicoApp } from "@/components/pedagogico/app";

export const Route = createFileRoute("/")({
  component: PedagogicoApp,
});
