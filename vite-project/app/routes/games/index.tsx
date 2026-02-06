import { Link } from "react-router";

export function meta() {
  return [
    { title: "Games Portal" },
    { name: "description", content: "Collection of mini games" },
  ];
}

export default function Games() {
  const games = [
    { name: "Snake", path: "/games/snake" },
    { name: "Tetris", path: "/games/tetris" },
    { name: "Minesweeper", path: "/games/minesweeper" },
    { name: "Flappy Bird", path: "/games/flappybird" },
    { name: "Super Mario", path: "/games/supermario" },
  ];

  return (
    <main className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Games Portal</h1>
      <ul className="space-y-2">
        {games.map((game) => (
          <li key={game.path}>
            <Link to={game.path} className="text-blue-600 hover:underline">
              {game.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
