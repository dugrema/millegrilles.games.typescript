import SnakeGame from "../../games/snake/Game";

export function meta() {
  return [
    { title: "Snake – Quick Match" },
    { name: "description", content: "Play Snake in the browser" },
  ];
}

export default function Snake() {
  return <SnakeGame />;
}
