import {
  Book,
  BookMinus,
  BookUp,
  BookUser,
  Home,
  Users,
  type LucideIcon,
} from "lucide-react";
export type NavLink = {
  title: string;
  path: string;
  Icon: LucideIcon;
  subLinks?: NavLink[];
};
export const nav_links = [
  {
    title: "Home",
    path: "/",
    Icon: Home,
  },
  {
    title: "Students",
    path: "/students",
    Icon: BookUser,
  },
  {
    title: "Staff",
    path: "/staff",
    Icon: Users,
  },
  {
    title: "Books",
    path: "/books/main",
    Icon: Book,
    subLinks: [
      {
        title: "Issue Book",
        path: "/books/lend",
        Icon: BookUp,
      },
      {
        title: "Overdue",
        path: "/books/overdue",
        Icon: BookMinus,
      },
    ],
  },
];
