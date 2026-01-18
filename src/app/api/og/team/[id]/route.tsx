import { ImageResponse } from 'next/og';
import { decodeShareData, getTeamMembersFromIndices, formatRunwayForShare } from '@/lib/share';

export const runtime = 'edge';

const fontCache = new Map<string, Promise<ArrayBuffer>>();

function loadFont(origin: string, path: string): Promise<ArrayBuffer> {
  const url = `${origin}${path}`;
  if (!fontCache.has(url)) {
    fontCache.set(
      url,
      fetch(url).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load font ${path}: ${res.status}`);
        }
        return res.arrayBuffer();
      })
    );
  }
  return fontCache.get(url)!;
}

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
    const summaryText = `"${data.s}"`;
    const sabotageText = `Sabotaged in ${runwayText}`;
    const baseUrl = 'https://series-a-sabotage.vercel.app';
    const photos = teamMembers.slice(0, 8);
    const origin = new URL(request.url).origin;
    const [dmSansRegular, dmSansBold, instrumentSerifRegular, instrumentSerifItalic] =
      await Promise.all([
        loadFont(origin, '/fonts/DM_Sans/static/DMSans-Regular.ttf'),
        loadFont(origin, '/fonts/DM_Sans/static/DMSans-Bold.ttf'),
        loadFont(origin, '/fonts/Instrument_Serif/InstrumentSerif-Regular.ttf'),
        loadFont(origin, '/fonts/Instrument_Serif/InstrumentSerif-Italic.ttf'),
      ]);

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
          fontFamily: 'DM Sans',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: 400,
            color: '#0038FF',
            marginBottom: '24px',
            fontFamily: 'Instrument Serif',
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
                zIndex: String(i),
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
            fontWeight: 400,
            color: '#0038FF',
            textAlign: 'center',
            maxWidth: '900px',
            marginBottom: '20px',
            padding: '0 40px',
          }}
        >
          {summaryText}
        </div>

        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: data.r < 3 ? '#dc2626' : '#0038FF',
          }}
        >
          {sabotageText}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '24px',
            fontWeight: 400,
            color: '#0038FF',
            opacity: 0.9,
            fontFamily: 'Instrument Serif',
          }}
        >
          Series A Sabotage
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'DM Sans',
          data: dmSansRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'DM Sans',
          data: dmSansBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Instrument Serif',
          data: instrumentSerifRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Instrument Serif',
          data: instrumentSerifItalic,
          weight: 400,
          style: 'italic',
        },
      ],
    }
    );
  } catch (e) {
    console.error('OG Image error:', e);
    return new Response('Error generating image', { status: 500 });
  }
}
