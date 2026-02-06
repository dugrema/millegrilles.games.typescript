import { Outlet } from "react-router";
import Games from "./games/index";

export default function GamesRoute() {
  return (
    <>
      <Games />
      <Outlet />
    </>
  );
}
