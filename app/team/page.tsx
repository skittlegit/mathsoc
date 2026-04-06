import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import TeamClient from "./TeamClient";
import type { YearData } from "./TeamClient";

export default function TeamPage() {
  const teamDir = join(process.cwd(), "public", "team");

  // Discover year folders (4-digit numbers)
  let yearFolders: string[] = [];
  try {
    yearFolders = readdirSync(teamDir)
      .filter((f) => /^\d{4}$/.test(f))
      .sort((a, b) => Number(b) - Number(a)); // newest first
  } catch {
    yearFolders = [];
  }

  // Load data for each year
  const dataByYear: Record<string, YearData> = {};
  for (const year of yearFolders) {
    const dataFile = join(teamDir, year, "data.json");
    if (existsSync(dataFile)) {
      dataByYear[year] = JSON.parse(readFileSync(dataFile, "utf-8")) as YearData;
    } else {
      // Auto-discover photos if no data.json
      const photoFiles = readdirSync(join(teamDir, year)).filter((f) =>
        /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
      );
      dataByYear[year] = {
        year,
        sections: [
          {
            label: "Team Members",
            members: photoFiles.map((f) => ({
              name: toTitle(f.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")),
              role: "",
              img: f,
            })),
          },
        ],
      };
    }
  }

  return <TeamClient years={yearFolders} dataByYear={dataByYear} />;
}

function toTitle(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
