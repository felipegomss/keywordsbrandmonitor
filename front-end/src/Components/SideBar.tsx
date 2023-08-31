import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Menu,
  Dashboard,
  BarChart,
  Description,
  ListAlt,
  People,
  ShoppingBasket,
  Settings,
  Tag,
  Face,
} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

const NAV_DATA = [
  { text: "Dashboard", icon: <Dashboard />, link: "/" },
  { text: "Análises", icon: <BarChart />, link: "/analyses" },
  {
    text: "Palavras-Chaves",
    icon: <ListAlt />,
    link: "/keywords",
  },
  { text: "Redes Sociais", icon: <Tag />, link: "/social" },
];

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const router = useRouter();
  const pathname = usePathname();

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  return (
    <>
      {isDesktop && (
        <Drawer anchor="left" open={true} variant="persistent">
          <List>
            <ListItem>
              <ListItemIcon>
                <Avatar
                  alt="Brand Monitor Logo"
                  src="https://uploads-ssl.webflow.com/605b962d5e846a3de31701a8/648b2a909901e175cf6bac04_favicon-48x48.png"
                />
              </ListItemIcon>
              <ListItemText>
                <strong className="leading-tight uppercase text-sky-600">
                  <span className="font-extrabold tracking-widest text-black">
                    Brand
                    <br />
                  </span>
                  Monitor
                </strong>
              </ListItemText>
            </ListItem>
          </List>
          <List className="flex flex-col justify-between h-full p-4">
            <span>
              {NAV_DATA.map((item, index) => (
                <div key={item.text}>
                  <ListItem
                    button
                    onClick={() => router.push(item.link)}
                    className={`hover:bg-gray-300 bg-white rounded-xl group ${
                      pathname === item.link
                        ? "bg-sky-500 hover:bg-sky-300 text-zinc-500 hover:text-zinc-200"
                        : ""
                    }`}
                  >
                    <ListItemIcon className="group-hover:animate-bounce">
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <strong>{item.text}</strong>
                    </ListItemText>
                  </ListItem>
                  {index < NAV_DATA.length - 1 && <Divider />}
                </div>
              ))}
            </span>
            <ListItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText>Configurações</ListItemText>
            </ListItem>
          </List>
        </Drawer>
      )}

      {!isDesktop && (
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
          <Drawer
            anchor="left"
            open={isOpen}
            onClose={toggleDrawer(false)}
            variant="temporary"
          >
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar
                    alt="Brand Monitor Logo"
                    src="https://uploads-ssl.webflow.com/605b962d5e846a3de31701a8/648b2a909901e175cf6bac04_favicon-48x48.png"
                  />
                </ListItemIcon>
                <ListItemText>
                  <strong className="leading-tight uppercase text-sky-600">
                    <span className="font-extrabold tracking-widest text-black">
                      Brand
                      <br />
                    </span>
                    Monitor
                  </strong>
                </ListItemText>
              </ListItem>
            </List>
            <List className="p-4">
              {NAV_DATA.map((item, index) => (
                <div key={item.text}>
                  <ListItem
                    button
                    onClick={() => router.push(item.link)}
                    className={`hover:bg-gray-300 bg-white rounded-xl group ${
                      pathname === item.link
                        ? "bg-sky-500 hover:bg-sky-300 text-zinc-500 hover:text-zinc-200"
                        : ""
                    }`}
                  >
                    <ListItemIcon className="group-hover:animate-bounce">
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <strong>{item.text}</strong>
                    </ListItemText>
                  </ListItem>
                  {index < NAV_DATA.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          </Drawer>
        </>
      )}
    </>
  );
}
