'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { posts } from '@/data/posts';
import BlogCard from '@/components/BlogCard';
import { Post } from '@/types/post';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredPosts = posts.filter((post: Post) => {
    const titleMatch = post.title.toLowerCase().includes(query);
    const contentMatch = post.content.toLowerCase().includes(query);
    const summaryMatch = post.summary.toLowerCase().includes(query);
    const categoryMatch = post.category.toLowerCase().includes(query);
    
    return titleMatch || contentMatch || summaryMatch || categoryMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        {query ? `"${query}" için arama sonuçları` : 'Tüm Yazılar'}
      </h1>
      {filteredPosts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aramanızla eşleşen sonuç bulunamadı.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post: Post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <SearchResults />
    </Suspense>
  );
} 