import React, { useState } from "react";
import { Link, useNavigation } from "react-router";
import { nav_links, NavLink } from "./constants";
import { ChevronRight, Menu, X } from "lucide-react";

type Props = {};

export default function MainNav({}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("/");

  function checkActive(path: string) {
    return (
      activeLink === path || (activeLink === "/" && activeLink.includes(path))
    );
  }
  function SideBarLink({
    link: { title, path, Icon, subLinks },
    iconSize = 30,
  }: Readonly<{
    link: NavLink;
    iconSize?: number;
  }>) {
    return (
      <Link
        to={path}
        onClick={() => setActiveLink(path)}
        className={`flex flex-col rounded-md items-center justify-center gap-2 w-full p-1 transition-all ${
          checkActive(path) && "text-blue-700 bg-gray-300"
        }`}>
        <div className='flex items-center justify-center gap-2 w-full'>
          <Icon size={iconSize} />
          {!collapsed && (
            <div className='flex items-center gap-2 flex-grow'>
              <span className='flex-grow'>{title}</span>
              <ChevronRight />
            </div>
          )}
        </div>

        {!collapsed &&
          (subLinks && activeLink.includes(path) ? (
            <div className='pl-3 w-full'>
              {subLinks.map((subLink) => (
                <SideBarLink iconSize={20} key={subLink.path} link={subLink} />
              ))}
            </div>
          ) : null)}
      </Link>
    );
  }

  return (
    <aside
      className={`h-full flex items-center flex-col duration-150 p-2  transition-[width] bg-gray-200 ${
        collapsed ? "w-20" : "w-64"
      }`}>
      <header className='flex w-full items-center justify-center gap-4 mb-10'>
        {!collapsed && <h1 className='flex-grow'>MCS Library</h1>}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu /> : <X />}
        </button>
      </header>
      <nav className='flex-grow flex flex-col gap-4 w-full'>
        {nav_links.map((link) => (
          <SideBarLink key={link.path} link={link} />
        ))}
      </nav>
    </aside>
  );
}
