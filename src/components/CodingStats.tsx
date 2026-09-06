import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Code2, Trophy, GitBranch, Target } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { ProgressRing } from "./ProgressRing";
import { GitHubGraph } from "./GitHubGraph";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

/* ---------------------------------------------
   GitHub Stats
---------------------------------------------- */
const fetchGitHubStats = async (username: string) => {
  // Use token if provided to increase rate limits. In Vite, add VITE_GITHUB_TOKEN to .env
  const token = (import.meta as any).env?.VITE_GITHUB_TOKEN;
  const headers: Record<string, string> = token ? { Authorization: `token ${token}` } : {};

  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileRes.ok) {
      const err = await profileRes.json().catch(() => ({}));
      throw new Error(`GitHub profile fetch failed: ${profileRes.status} ${err.message ?? ""}`);
    }
    const profile = await profileRes.json();

    // Fetch repos with pagination (in case of >100 repos)
    let repos: any[] = [];
    let page = 1;
    const per_page = 100;
    while (true) {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}`, { headers });
      if (!reposRes.ok) {
        const err = await reposRes.json().catch(() => ({}));
        throw new Error(`GitHub repos fetch failed: ${reposRes.status} ${err.message ?? ""}`);
      }
      const pageRepos = await reposRes.json();
      if (!Array.isArray(pageRepos)) break;
      repos = repos.concat(pageRepos);
      if (pageRepos.length < per_page) break;
      page += 1;
    }

    const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);

    return {
      repos: profile.public_repos || repos.length || 0,
      followers: profile.followers || 0,
      stars: totalStars || 0,
      contributions: 0,
    };
  } catch (e) {
    console.error("GitHub API failed", e);
    throw e;
  }
};

/* Note: LeetCode and CodeChef public proxies are unreliable.
   This component now fetches only GitHub live stats. LeetCode and CodeChef
   sections are rendered as profile links (no fetching) to avoid runtime failures. */

/* ---------------------------------------------
   MAIN COMPONENT
---------------------------------------------- */
export const CodingStats = () => {
  const GITHUB_USERNAME = "kishore-lang";
  const LEETCODE_USERNAME = "FZr2ONygTE";
  const CODECHEF_USERNAME = "glee_kite_24";

  const { data: github } = useQuery({
    queryKey: ["github"],
    queryFn: () => fetchGitHubStats(GITHUB_USERNAME),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="relative min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ---- TITLE ---- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center text-4xl font-bold mb-10"
        >
          Coding Profile Stats
        </motion.h2>

        {/* ---- STATS SECTIONS ---- */}
        <div className="space-y-12">

          {/* ------ GitHub Section ------ */}
          <StatSection title="GitHub" link={`https://github.com/${GITHUB_USERNAME}`}>
            {github ? (
              <>
                <StatItem label="Repositories" value={github.repos} icon={<GitBranch />} />
                <StatItem label="Stars" value={github.stars} icon={<Trophy />} />
                <StatItem label="Followers" value={github.followers} icon={<Target />} />
                <div className="col-span-2 mt-4">
                  <GitHubGraph username={GITHUB_USERNAME} />
                </div>
              </>
            ) : (
              <div className="col-span-4 p-4 text-center text-sm text-muted-foreground">Loading GitHub stats…</div>
            )}
          </StatSection>

          {/* ------ LeetCode & CodeChef Section (Tabbed) ------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border"
          >
            <h3 className="text-3xl font-semibold mb-6">Coding Profiles</h3>
            
            <Tabs defaultValue="leetcode" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
                <TabsTrigger value="codechef">CodeChef</TabsTrigger>
              </TabsList>

              <TabsContent value="leetcode" className="mt-6">
                <div className="text-center">
                  <a
                    href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
                  >
                    View LeetCode Profile
                  </a>
                </div>
              </TabsContent>

              <TabsContent value="codechef" className="mt-6">
                <div className="text-center">
                  <a
                    href={`https://www.codechef.com/users/${CODECHEF_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
                  >
                    View CodeChef Profile
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------
   SMALL COMPONENTS
---------------------------------------------- */

const StatSection = ({ title, link, children }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border"
  >
    <div className="flex justify-between mb-6">
      <h3 className="text-3xl font-semibold">{title}</h3>
      <a href={link} target="_blank" className="text-primary text-sm hover:underline">
        View →
      </a>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{children}</div>
  </motion.div>
);

const StatItem = ({ label, value, icon }: any) => (
  <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border">
    <div className="text-primary mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value ?? 0}</div>
    <span className="text-sm opacity-70">{label}</span>
  </div>
);
