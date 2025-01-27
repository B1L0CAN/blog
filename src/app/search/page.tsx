'use client';

import { useSearchParams } from 'next/navigation';
import { posts } from '@/data/posts';
import Link from 'next/link';

function highlightText(text: string, query: string) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <span key={i} className="bg-yellow-500/20 text-yellow-200">{part}</span> : 
      part
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const searchResults = posts.filter(post => {
    const searchContent = `${post.title} ${post.content} ${post.summary} ${post.category}`.toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-400 hover:underline mb-8 block">
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-2xl font-bold text-white mb-4">
          Arama Sonuçları: "{query}"
          <span className="text-gray-400 text-lg font-normal ml-2">
            ({searchResults.length} sonuç)
          </span>
        </h1>

        {searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map(post => (
              <div key={post.id} className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <Link href={`/posts/${post.slug}?highlight=${encodeURIComponent(query)}`}>
                  <h2 className="text-xl font-bold mb-2 text-white hover:text-blue-400 transition-colors">
                    {highlightText(post.title, query)}
                  </h2>
                </Link>
                <p className="text-gray-300 mb-4">
                  {highlightText(post.summary, query)}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                    {highlightText(post.category, query)}
                  </span>
                  <span>
                    {new Date(post.date).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">
            Aramanızla eşleşen sonuç bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
          </p>
        )}
      </div>
    </div>
  );
} 