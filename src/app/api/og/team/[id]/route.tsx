import { ImageResponse } from 'next/og';
import { decodeShareData, getTeamMembersFromIndices, formatRunwayForShare } from '@/lib/share';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = decodeShareData(id);

    if (!data) {
      return new Response('Invalid share data', { status: 400 });
    }

    const teamMembers = getTeamMembersFromIndices(data.t);
    if (teamMembers.length === 0) {
      return new Response('No team members found', { status: 400 });
    }

    const runwayText = formatRunwayForShare(data.r);
    const baseUrl = 'https://series-a-sabotage.vercel.app';
    const photos = teamMembers.slice(0, 8);

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
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#0038FF',
            marginBottom: '24px',
          }}
        >
          {data.n}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          {photos.map((member, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: '90px',
                height: '110px',
                backgroundColor: 'white',
                padding: '5px',
                paddingBottom: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                marginLeft: i === 0 ? '0' : '-20px',
                zIndex: i,
              }}
            >
              <img
                src={`${baseUrl}/headshots/${member.avatar}`}
                alt={member.name}
                width={80}
                height={80}
                style={{ objectFit: 'cover', width: '80px', height: '80px' }}
              />
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: '24px',
            color: '#0038FF',
            textAlign: 'center',
            maxWidth: '900px',
            marginBottom: '20px',
            padding: '0 40px',
          }}
        >
          &quot;{data.s}&quot;
        </div>

        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: data.r < 3 ? '#dc2626' : '#0038FF',
          }}
        >
          Sabotaged in {runwayText}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#0038FF',
            opacity: 0.5,
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
  } catch (e) {
    console.error('OG Image error:', e);
    return new Response('Error generating image', { status: 500 });
  }
}
