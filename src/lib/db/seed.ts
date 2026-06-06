import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

async function seed() {
  const { db } = await import("../db");
  const { projectStats } = await import("./schema");

  console.log("Seeding project_stats...");

  const rows = [
    { projectName: "outeye2", metricName: "语料总量", metricValue: 21381 },
    { projectName: "outeye2", metricName: "词汇量", metricValue: 45672 },
    { projectName: "outeye3", metricName: "完成进度", metricValue: 60 },
    { projectName: "outeye3", metricName: "课程数", metricValue: 12 },
    { projectName: "outeye4", metricName: "评论数", metricValue: 200 },
    { projectName: "outeye4", metricName: "帖子数", metricValue: 85 },
    { projectName: "challenge-cup", metricName: "完成进度", metricValue: 35 },
  ];

  // Insert all rows (duplicates are fine — each is a snapshot record)
  await db.insert(projectStats).values(rows);

  console.log(`Inserted ${rows.length} rows.`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
