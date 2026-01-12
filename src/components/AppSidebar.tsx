import { TbBrandThreejs } from "react-icons/tb";
import { FaBug, FaCat, FaFire, FaItchIo, FaList, FaRobot, FaScissors } from "react-icons/fa6";
import { FaHome, FaStar, FaGooglePlay } from "react-icons/fa";
import { BsGpuCard } from "react-icons/bs";
import { GiDinosaurRex, GiGrapple, GiSlime, GiCubeforce } from "react-icons/gi";
import { BiSolidInvader } from "react-icons/bi";
import { FaTree } from "react-icons/fa6";
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
    title: "Shader Loader",
    url: "shader",
    target: "_self",
    icon: FaStar,
  },
  {
    title: "GLB Loader",
    url: "glbloader",
    target: "_self",
    icon: GiCubeforce,
  },
  {
    title: "Particles",
    url: "particles",
    target: "_self",
    icon: FaFire,
  },
  {
    title: "WebGPU",
    url: "webgpu",
    target: "_self",
    icon: BsGpuCard,
  },
  {
    title: "Potree Viewer",
    url: "potree",
    target: "_self",
    icon: FaTree,
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
  {
    title: "Purrfect Pizza & Fish Delivery",
    url: "https://adrieldf.itch.io/purrfect-pizza-fish-delivery",
    target: "_blank",
    icon: FaCat,
  },
  {
    title: "Grapple Against Time",
    url: "https://adrieldf.itch.io/grapple-against-time",
    target: "_blank",
    icon: GiGrapple,
  },
  {
    title: "Game Invaders",
    url: "https://adrieldf.itch.io/game-invaders",
    target: "_blank",
    icon: BiSolidInvader,
  },
  {
    title: "Bob, The Robot",
    url: "https://adrieldf.itch.io/bob-the-robot",
    target: "_blank",
    icon: FaRobot,
  },
  {
    title: "Keep the dinosaur alive",
    url: "https://adrieldf.itch.io/keep-the-dinosaur-alive",
    target: "_blank",
    icon: GiDinosaurRex,
  },
  {
    title: "Rock Paper Scissors Lies",
    url: "https://adrieldf.itch.io/rock-paper-scissors-lies",
    target: "_blank",
    icon: FaScissors,
  },
  {
    title: "Sam the Slime slayer",
    url: "https://adrieldf.itch.io/sam-the-slime-slayer",
    target: "_blank",
    icon: GiSlime,
  },
  {
    title: "Run Cockroach Run",
    url: "https://adrieldf.itch.io/run-cockroach-run",
    target: "_blank",
    icon: FaBug,
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
