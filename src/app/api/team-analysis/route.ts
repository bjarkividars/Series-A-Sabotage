import OpenAI from 'openai';

const openai = new OpenAI();

interface TeamMember {
  name: string;
  role: string;
}

interface RequestBody {
  team: TeamMember[];
  mode: 'roast' | 'praise';
  startupName: string;
  runway: number;
}

function formatRunway(runway: number): string {
  if (runway === Infinity) return 'infinite runway';

  const totalMonths = runway;
  const years = Math.floor(totalMonths / 12);
  const months = Math.floor(totalMonths % 12);
  const days = Math.floor((totalMonths % 1) * 30);
  const hours = Math.floor(((totalMonths % 1) * 30 % 1) * 24);
  const minutes = Math.floor((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60);
  const seconds = Math.floor(((((totalMonths % 1) * 30 % 1) * 24 % 1) * 60 % 1) * 60);

  if (years > 0) {
    return months > 0 ? `${years} years, ${months} months` : `${years} years`;
  }
  if (months > 0) {
    return days > 0 ? `${months} months, ${days} days` : `${months} months`;
  }
  if (days > 0) {
    return hours > 0 ? `${days} days, ${hours} hours` : `${days} days`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours} hours, ${minutes} minutes` : `${hours} hours`;
  }
  if (minutes > 0) {
    return seconds > 0 ? `${minutes} minutes, ${seconds} seconds` : `${minutes} minutes`;
  }
  return `${seconds} seconds`;
}

function buildTeamSummary(
  team: TeamMember[],
  startupName: string,
  runway: number
): string {
  const runwayText = formatRunway(runway);

  const teamList = team
    .map((m) => `- ${m.name} (${m.role})`)
    .join('\n');

  return `Startup: ${startupName}
Runway: ${runwayText}
Team (${team.length} members):
${teamList}`;
}

export async function POST(request: Request) {
  const { team, mode, startupName, runway }: RequestBody = await request.json();

  const instructions =
    mode === 'roast'
      ? "You're a brutally honest startup critic. Roast this team in 2-3 punchy sentences. Be savage but funny. Mention what they'd realistically accomplish (or fail to accomplish) in their runway time. Use your knowledge of who these people are - don't just read their stats."
      : "You're an enthusiastic startup hype-man. Praise this team in 2-3 punchy sentences. Be over-the-top positive about what they could build in their runway time. Use your knowledge of who these people are - don't just read their stats.";

  const teamSummary = buildTeamSummary(team, startupName, runway);

  const stream = await openai.responses.create({
    model: 'gpt-4.1-mini',
    instructions,

    input: teamSummary,

    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
          controller.enqueue(encoder.encode(event.delta));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
