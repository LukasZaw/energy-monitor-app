import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "~/lib/axios"; // Upewnij się, że ten import istnieje

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 to-background">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            ⚡ Power Monitor
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost">
            <a href="/login">Login</a>
          </Button>
          <Button asChild>
            <a href="/register">Get Started</a>
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <Card className="max-w-xl w-full shadow-xl bg-background/80">
          <CardHeader className="items-center">
            <CardTitle className="text-3xl md:text-4xl text-center">
              Welcome to Power Monitor
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              Track, analyze, and optimize your energy usage with beautiful
              charts and smart insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-64 h-40 flex items-center justify-center rounded-xl bg-white shadow-inner">
              <img
                src="/energy-illustration.svg"
                alt="Energy Illustration"
                className="w-48 h-32 object-contain"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }}
              />
            </div>
            <ul className="text-muted-foreground text-base space-y-2">
              <li>✅ Visualize your energy consumption</li>
              <li>✅ Manage devices and monitor trends</li>
              <li>✅ Export data for further analysis</li>
              <li>✅ Secure, modern, and easy to use</li>
            </ul>
            <Button asChild size="lg" className="w-full mt-2">
              <a href="/register">Start Monitoring Now</a>
            </Button>
          </CardContent>
        </Card>
        {/* Cool animated stats section */}
        <section className="mt-12 w-full max-w-2xl flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Live Energy Stats
          </h2>
          <LiveStats />
        </section>
      </main>
      <footer className="text-center text-muted-foreground py-6 text-sm">
        Built with <span className="text-primary">♥</span> using React &
        shadcn/ui
      </footer>
    </div>
  );
}

// Animated Stat Card component
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Animate numbers if value is numeric
    const num = parseInt(value.replace(/[^\d]/g, ""));
    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * num);
      setDisplayValue(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(num.toLocaleString());
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center bg-card rounded-xl shadow-lg p-6 border border-border hover:scale-105 transition-transform duration-300 group"
    >
      <span className="text-4xl mb-2 group-hover:animate-bounce">{icon}</span>
      <span className="text-3xl font-bold text-primary group-hover:text-accent-foreground transition-colors">
        {displayValue}
      </span>
      <span className="text-muted-foreground mt-1 text-base">{label}</span>
    </div>
  );
}

function LiveStats() {
  const [stats, setStats] = useState<{
    totalUsers: number;
    devicesConnected: number;
    kwhTracked: number;
  } | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axiosInstance.get("users/summary");
        console.log("Fetched stats:", response.data);
        setStats(response.data);
      } catch (error) {
        setStats(null);
      }
    }
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <StatCard label="Total Users" value="..." icon="👥" />
        <StatCard label="Devices Connected" value="..." icon="🔌" />
        <StatCard label="kWh Tracked" value="..." icon="⚡" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <StatCard
        label="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon="👥"
      />
      <StatCard
        label="Devices Connected"
        value={stats.devicesConnected.toLocaleString()}
        icon="🔌"
      />
      <StatCard
        label="kWh Tracked"
        value={stats.kwhTracked.toLocaleString()}
        icon="⚡"
      />
    </div>
  );
}
