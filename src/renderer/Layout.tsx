import React from "react";
import { Outlet } from "react-router";
import MainNav from "./components/MainNav";
import { ScrollArea } from "./components/ui/scroll-area";

type Props = {};

export default function RootLayout() {
  return (
    <main className='flex items-center h-screen w-screen'>
      <MainNav />
      <ScrollArea className='flex-grow h-full'>
        <Outlet />
      </ScrollArea>
    </main>
  );
}
