import { ImageResponse } from 'next/og';
import { decodeShareData, getTeamMembersFromIndices, formatRunwayForShare } from '@/lib/share';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = decodeShareData(id);

  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const teamMembers = getTeamMembersFromIndices(data.t);
  const runwayText = formatRunwayForShare(data.r);
  const baseUrl = new URL(request.url).origin;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F6FF00',
          padding: '40px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#0038FF',
            marginBottom: '16px',
          }}
        >
          {data.n}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px',
            maxWidth: '900px',
          }}
        >
          {teamMembers.slice(0, 8).map((member, i) => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                width: '100px',
                height: '120px',
                backgroundColor: 'white',
                padding: '6px',
                paddingBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (3 + i % 5)}deg)`,
              }}
            >
              <img
                src={`${baseUrl}/headshots/${member.avatar}`}
                width={88}
                height={88}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: '28px',
            color: '#0038FF',
            textAlign: 'center',
            maxWidth: '1000px',
            fontStyle: 'italic',
            marginBottom: '24px',
            padding: '0 20px',
          }}
        >
          &ldquo;{data.s}&rdquo;
        </div>

        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: data.r < 3 ? '#dc2626' : '#0038FF',
          }}
        >
          Sabotaged in {runwayText}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '20px',
            color: '#0038FF',
            opacity: 0.6,
          }}
        >
          Series A Sabotage
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
