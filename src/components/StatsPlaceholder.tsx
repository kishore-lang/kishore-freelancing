import React from "react";

export const StatsPlaceholder = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md p-8 rounded-2xl border text-center">
        <h2 className="text-2xl font-semibold mb-3">Coding Stats Temporarily Unavailable</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Third-party APIs used to fetch LeetCode and CodeChef data are currently unreliable. You can still view
          the profiles directly below.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://github.com/kishore-lang"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-secondary text-background font-semibold"
          >
            View GitHub
          </a>
          <a
            href="https://leetcode.com/u/FZr2ONygTE/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border"
          >
            View LeetCode
          </a>
          <a
            href="https://www.codechef.com/users/glee_kite_24"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md border"
          >
            View CodeChef
          </a>
        </div>
      </div>
    </section>
  );
};

export default StatsPlaceholder;
