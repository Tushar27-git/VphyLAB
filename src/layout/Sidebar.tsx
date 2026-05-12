"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Waves, 
  Lightbulb, 
  FlaskConical, 
  ChevronRight, 
  LayoutDashboard,
  BookOpen
} from "lucide-react";

const experiments = [
  {
    category: "Oscillation & Mechanics",
    icon: <Waves className="w-5 h-5" />,
    items: [
      { name: "Bar Pendulum", href: "/oscillation/bar-pendulum" },
    ],
  },
  {
    category: "Optics & Modern Physics",
    icon: <Lightbulb className="w-5 h-5" />,
    items: [
      { name: "Optical Fiber", href: "/optics/fiber-aperture" },
    ],
  },
  {
    category: "Circuits & Electronics",
    icon: <Lightbulb className="w-5 h-5" />,
    items: [
      { name: "RC Circuit Simulator", href: "/circuits/rc-circuit" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 sticky top-0 flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">PhysLab <span className="text-blue-500">2.0</span></h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8 mt-4">
        <div>
          <Link 
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/dashboard" ? "bg-blue-600 transition-all shadow-lg shadow-blue-900/40 text-white" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

        {experiments.map((group) => (
          <div key={group.category} className="space-y-2">
            <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {group.icon}
              {group.category}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all group ${
                      isActive 
                        ? "bg-slate-800 text-white" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-blue-400" : "opacity-0 group-hover:opacity-100"}`} />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-800">
          <Link 
            href="/journal"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/journal" ? "bg-slate-800 text-white" : "hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Lab Journal</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">JD</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Physics Student</p>
            <p className="text-xs text-slate-500 truncate">phys-std-101@university.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
