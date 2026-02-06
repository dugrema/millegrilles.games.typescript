import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix("games", [
    index("routes/games.tsx"),
    route("snake", "routes/games/snake.tsx"),
    route("tetris", "routes/games/tetris.tsx"),
    route("flappybird", "routes/games/flappybird.tsx"),
    route("minesweeper", "routes/games/minesweeper.tsx"),
    route("supermario", "routes/games/supermario.tsx"),
  ]),
] satisfies RouteConfig;
