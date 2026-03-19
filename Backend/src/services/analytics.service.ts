import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function clampDays(days: unknown, defaultDays: number): number {
  const n = typeof days === "string" ? Number(days) : Number(days);
  if (!Number.isFinite(n)) return defaultDays;
  return Math.max(1, Math.min(90, Math.floor(n)));
}

function toUTCDateStr(d: Date): string {
  // SQLite stores CURRENT_TIMESTAMP in UTC, so we build day buckets in UTC too.
  return d.toISOString().slice(0, 10);
}

function buildDayBuckets(end: Date, days: number): string[] {
  const buckets: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * MS_PER_DAY);
    buckets.push(toUTCDateStr(d));
  }
  return buckets;
}

export type DauPoint = { day: string; dau: number };
export type RetentionPoint = {
  day: string;
  activeUsers: number;
  retainedUsers: number;
  retentionRate: number; // 0..1
};

export async function getDau(daysQuery: unknown): Promise<DauPoint[]> {
  const days = clampDays(daysQuery, 14);

  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * MS_PER_DAY);

  const rows = (await prisma.$queryRaw<Array<{ day: string; dau: number }>>`
    SELECT
      date(timestamp) AS day,
      COUNT(DISTINCT user_id) AS dau
    FROM "FeatureClick"
    WHERE timestamp >= ${start.toISOString()}
      AND timestamp < ${end.toISOString()}
    GROUP BY day
    ORDER BY day ASC
  `) as Array<{ day: string; dau: number }>;

  const dayToDau = new Map<string, number>();
  for (const row of rows) dayToDau.set(row.day, Number(row.dau));

  const buckets = buildDayBuckets(end, days);
  return buckets.map((day) => ({ day, dau: dayToDau.get(day) ?? 0 }));
}

export async function getRetention(
  daysQuery: unknown
): Promise<RetentionPoint[]> {
  // Basic next-day retention:
  // For each day D: retainedUsers = users active on D and on D+1.
  // We exclude the "last day" bucket because D+1 may be incomplete/missing.
  const days = clampDays(daysQuery, 14);

  const end = new Date();
  const endDayStr = toUTCDateStr(end);

  // Active range needs D and D+1, so we go back (days + 1) for the SQL.
  const startActivity = new Date(end.getTime() - (days + 1) * MS_PER_DAY);

  // Buckets we return are [endDayStr - days, endDayStr) => excludes today.
  const startDayForBuckets = new Date(end.getTime() - days * MS_PER_DAY);
  const startDayStr = toUTCDateStr(startDayForBuckets);

  const rows = (await prisma.$queryRaw<
    Array<{
      day: string;
      active_users: number;
      retained_users: number;
    }>
  >`
    WITH activity AS (
      SELECT
        date(timestamp) AS day,
        user_id
      FROM "FeatureClick"
      WHERE timestamp >= ${startActivity.toISOString()}
        AND timestamp < ${end.toISOString()}
    )
    SELECT
      a.day AS day,
      COUNT(DISTINCT a.user_id) AS active_users,
      COUNT(DISTINCT b.user_id) AS retained_users
    FROM activity a
    LEFT JOIN activity b
      ON b.user_id = a.user_id
      AND b.day = date(a.day, '+1 day')
    WHERE a.day >= ${startDayStr}
      AND a.day < ${endDayStr}
    GROUP BY a.day
    ORDER BY a.day ASC
  `) as Array<{
    day: string;
    active_users: number;
    retained_users: number;
  }>;

  const dayToStats = new Map<
    string,
    { activeUsers: number; retainedUsers: number }
  >();
  for (const row of rows) {
    dayToStats.set(row.day, {
      activeUsers: Number(row.active_users),
      retainedUsers: Number(row.retained_users),
    });
  }

  // Return one point per bucket day.
  // For days=N, we return N buckets excluding "today", i.e. N points.
  const buckets = buildDayBuckets(end, days);
  // buildDayBuckets includes today; we want [startDayStr, endDayStr) so drop the last bucket.
  const bucketsExcludingToday = buckets.slice(0, buckets.length - 1);

  return bucketsExcludingToday.map((day) => {
    const stats = dayToStats.get(day);
    const activeUsers = stats?.activeUsers ?? 0;
    const retainedUsers = stats?.retainedUsers ?? 0;
    const retentionRate = activeUsers > 0 ? retainedUsers / activeUsers : 0;
    return { day, activeUsers, retainedUsers, retentionRate };
  });
}

export async function getOverview(daysQuery: unknown): Promise<{
  totalUsers: number;
  dau: DauPoint[];
  retention: RetentionPoint[];
}> {
  // Keep "overview" compact by reusing a smaller default window.
  const days = clampDays(daysQuery, 14);
  const [totalUsers, dau, retention] = await Promise.all([
    prisma.user.count(),
    getDau(days),
    getRetention(days),
  ]);

  return { totalUsers, dau, retention };
}

