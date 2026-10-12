import { TEST_WARNING } from "@/lib/pedagogico/test-publication";

export function TestBanner() {
  return (
    <p
      role="status"
      className="sticky top-0 z-30 border-b border-line bg-[#f3e6c8] px-4 py-3 text-center text-sm font-medium text-fg"
    >
      {TEST_WARNING}
    </p>
  );
}
