import { Link } from "react-router";
import type { Route } from "./+types/home";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">
        Welcome to the React Router Games Portal
      </h1>
      <p className="text-lg">Explore the collection of simple games below.</p>
      <Link
        to="/games"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
      >
        Go to Games
      </Link>
    </main>
  );
}
