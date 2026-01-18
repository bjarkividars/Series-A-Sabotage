import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { decodeShareData, getTeamMembersFromIndices, formatRunwayForShare } from '@/lib/share';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = decodeShareData(id);

  if (!data) {
    return { title: 'Share Not Found' };
  }

  const baseUrl = 'https://series-a-sabotage.vercel.app';
  const ogImageUrl = `${baseUrl}/api/og/team/${id}`;

  return {
    title: `${data.n} - Series A Sabotage`,
    description: data.s,
    openGraph: {
      title: `${data.n} - Series A Sabotage`,
      description: data.s,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${data.n} dream team`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.n} - Series A Sabotage`,
      description: data.s,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const data = decodeShareData(id);

  if (!data) {
    return (
      <div className="min-h-screen bg-highlight-yellow flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-royal-blue mb-4">Page Not Found</h1>
          <Link href="/" className="text-royal-blue underline">
            Build your own dream team
          </Link>
        </div>
      </div>
    );
  }

  const teamMembers = getTeamMembersFromIndices(data.t);
  const runwayText = formatRunwayForShare(data.r);

  return (
    <div className="min-h-screen bg-highlight-yellow">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-royal-blue mb-2">
            {data.n}
          </h1>
          <p className="text-xl md:text-2xl text-royal-blue/70">
            Sabotaged in{' '}
            <span className="font-bold text-royal-blue">{runwayText}</span>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {teamMembers.slice(0, 8).map((member, i) => (
            <div
              key={member.id}
              className="w-20 h-24 md:w-24 md:h-28 bg-white p-1 pb-3 shadow-lg"
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)` }}
            >
              <div className="relative w-full h-full overflow-hidden bg-gray-100">
                <Image
                  src={`/headshots/${member.avatar}`}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          ))}
        </div>

        <blockquote className="text-center text-lg md:text-xl text-royal-blue italic mb-8 px-4">
          &ldquo;{data.s}&rdquo;
        </blockquote>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block py-3 px-8 bg-royal-blue text-white rounded-full font-semibold hover:bg-royal-blue/80 transition-colors"
          >
            Build your own dream team
          </Link>
        </div>
      </div>
    </div>
  );
}
