import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-fg">
      <Link className="text-accent hover:underline" href="/es">
        Ir a Pásame Exámenes
      </Link>
    </main>
  );
}
