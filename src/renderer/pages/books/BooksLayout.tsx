import React from "react";
import { Outlet } from "react-router";

type Props = {};

export default function BooksLayout({}: Props) {
  return (
    <div>
      <Outlet />
    </div>
  );
}
