import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod.mjs';
import z from 'zod';

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

const ResponseFormat = z.object({
  oneLineSummary: z.string().describe('A one-line summary of the team'),
});

const RoastResponseFormat = ResponseFormat.extend({
  roast: z.string().describe('A roast of the team'),
});

const PraiseResponseFormat = ResponseFormat.extend({
  praise: z.string().describe('A praise of the team'),
});

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
    text: {
      format: zodTextFormat(mode === 'roast' ? RoastResponseFormat : PraiseResponseFormat, 'text'),

    }, stream: true
  });



  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let accumulatedText = '';
      let lastProcessedLength = 0;
      let sentMetadata = false;
      const targetField = mode;
      const fieldPattern = new RegExp(`"${targetField}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, 's');
      const summaryPattern = /"oneLineSummary"\s*:\s*"((?:[^"\\]|\\.)*)"/;

      const decodeJsonString = (raw: string) => {
        return raw.replace(/\\(.)/g, (_, char) => {
          switch (char) {
            case 'n': return '\n';
            case 't': return '\t';
            case 'r': return '\r';
            case '"': return '"';
            case '\\': return '\\';
            default: return char;
          }
        });
      };

      for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
          accumulatedText += event.delta;

          if (!sentMetadata) {
            const summaryMatch = accumulatedText.match(summaryPattern);
            if (summaryMatch && summaryMatch[1]) {
              const oneLineSummary = decodeJsonString(summaryMatch[1]);
              controller.enqueue(encoder.encode(JSON.stringify({ oneLineSummary }) + '\n---\n'));
              sentMetadata = true;
            }
          }

          const match = accumulatedText.match(fieldPattern);
          if (match && match[1]) {
            const rawContent = match[1];

            let trailingBackslashes = 0;
            for (let i = rawContent.length - 1; i >= 0 && rawContent[i] === '\\'; i--) {
              trailingBackslashes++;
            }
            const processableLength = trailingBackslashes % 2 === 1
              ? rawContent.length - 1
              : rawContent.length;

            if (processableLength > lastProcessedLength) {
              const newRaw = rawContent.slice(lastProcessedLength, processableLength);
              const decoded = decodeJsonString(newRaw);

              controller.enqueue(encoder.encode(decoded));
              lastProcessedLength = processableLength;
            }
          }
        }
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
