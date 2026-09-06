import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface GitHubGraphProps {
  username: string;
}

// Generate mock contribution data (in production, use GitHub GraphQL API)
const generateMockContributions = () => {
  const weeks = 52;
  const data = [];
  
  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      weekData.push({
        date: new Date(Date.now() - (weeks - week) * 7 * 24 * 60 * 60 * 1000 + day * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 15),
      });
    }
    data.push(weekData);
  }
  
  return data;
};

export const GitHubGraph = ({ username }: GitHubGraphProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);
  
  const { data: contributions } = useQuery({
    queryKey: ["contributions", username],
    queryFn: () => generateMockContributions(),
  });

  const getColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted) / 0.2)";
    if (count < 3) return "hsl(var(--primary) / 0.3)";
    if (count < 6) return "hsl(var(--primary) / 0.5)";
    if (count < 9) return "hsl(var(--primary) / 0.7)";
    return "hsl(var(--primary))";
  };

  if (!contributions) return null;

  return (
    <div className="relative">
      <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contribution Activity</h4>
      
      <div className="overflow-x-auto pb-4 -mx-2 sm:mx-0">
        <div className="inline-flex gap-0.5 sm:gap-1 px-2 sm:px-0" style={{ minWidth: "max-content" }}>
          {contributions.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: (weekIndex * 7 + dayIndex) * 0.001 
                  }}
                  whileHover={{ scale: 1.2 }}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm cursor-pointer transition-all"
                  style={{
                    backgroundColor: getColor(day.count),
                    boxShadow: day.count > 5 ? `0 0 8px ${getColor(day.count)}` : "none",
                  }}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-popover border border-border rounded-lg text-xs sm:text-sm whitespace-nowrap z-50"
        >
          <p className="font-semibold">{hoveredCell.count} contributions</p>
          <p className="text-muted-foreground text-xs">{hoveredCell.date}</p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 sm:mt-4 text-xs text-muted-foreground justify-center sm:justify-start">
        <span className="text-xs">Less</span>
        <div className="flex gap-0.5 sm:gap-1">
          {[0, 3, 6, 9, 12].map((count) => (
            <div
              key={count}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm"
              style={{ backgroundColor: getColor(count) }}
            />
          ))}
        </div>
        <span className="text-xs">More</span>
      </div>
    </div>
  );
};
