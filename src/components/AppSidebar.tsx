import { TbBrandThreejs } from "react-icons/tb";
import { FaFire, FaItchIo } from "react-icons/fa6";
import { FaHome, FaStar, FaGooglePlay } from "react-icons/fa";
import { BsGpuCard } from "react-icons/bs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Home",
    url: "/",
    target: "_self",
    icon: FaHome,
  },
];

const webItems = [
  {
    title: "Three.js Basic",
    url: "threebasic",
    target: "_self",
    icon: TbBrandThreejs,
  },
  {
    title: "Three.js High Quality",
    url: "#",
    target: "_self",
    icon: TbBrandThreejs,
  },
  {
    title: "Three.js City",
    url: "#",
    target: "_self",
    icon: TbBrandThreejs,
  },
  {
    title: "Shaders",
    url: "#",
    target: "_self",
    icon: FaStar,
  },
  {
    title: "Particles",
    url: "#",
    target: "_self",
    icon: FaFire,
  },
  {
    title: "WebGPU",
    url: "#",
    target: "_self",
    icon: BsGpuCard,
  },
];
const gameItems = [
  {
    title: "Itch.io Profile",
    url: "https://adrieldf.itch.io",
    target: "_blank",
    icon: FaItchIo,
  },
  {
    title: "Dino Survival Game",
    url: "https://play.google.com/store/apps/details?id=com.tubarogames.dinosurvival",
    target: "_blank",
    icon: FaGooglePlay,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} target={item.target}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Web</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {webItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} target={item.target}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Games</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gameItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} target={item.target}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}