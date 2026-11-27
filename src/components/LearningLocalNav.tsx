import { CalendarRange, ClipboardList, LayoutDashboard } from "lucide-react";

const learningLinks = [
  { href: "/learning", label: "Overview", icon: LayoutDashboard },
  { href: "/learning/board", label: "Delivery", icon: ClipboardList },
  { href: "/learning/timeline", label: "Timeline", icon: CalendarRange },
] as const;

export function LearningLocalNav({ current }: { current: "Overview" | "Delivery" | "Timeline" }) {
  return (
    <nav className="learningLocalNav shell" aria-label="Learning workspace">
      {learningLinks.map((item) => {
        const Icon = item.icon;
        return (
          <a href={item.href} key={item.href} aria-current={item.label === current ? "page" : undefined}>
            <Icon size={16} aria-hidden="true" /> {item.label}
          </a>
        );
      })}
    </nav>
  );
}
