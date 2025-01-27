import { Post } from '@/types/post';
import { posts } from '@/data/posts';
import Link from 'next/link';

interface PostNavigationProps {
  currentPost: Post;
}

export default function PostNavigation({ currentPost }: PostNavigationProps) {
  // Aynı kategorideki yazıları bul ve ID'ye göre sırala (büyükten küçüğe)
  const categoryPosts = posts
    .filter(post => post.category === currentPost.category)
    .sort((a, b) => b.id - a.id); // ID'ye göre sıralama

  // Mevcut yazının indeksini bul
  const currentIndex = categoryPosts.findIndex(post => post.id === currentPost.id);

  // Önceki yazı: Daha küçük ID'ye sahip yazı
  const previousPost = currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1] : null;
  
  // Sonraki yazı: Daha büyük ID'ye sahip yazı
  const nextPost = currentIndex > 0 ? categoryPosts[currentIndex - 1] : null;

  if (!previousPost && !nextPost) return null;

  return (
    <div className="border-t border-gray-700 mt-12 pt-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {previousPost && (
          <Link
            href={`/posts/${previousPost.slug}`}
            className="flex-1 group p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 bg-gray-800/50 transition-all"
          >
            <div className="text-sm text-gray-400 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Önceki Yazı
            </div>
            <div className="text-white group-hover:text-blue-400 transition-colors">
              {previousPost.title}
            </div>
          </Link>
        )}

        {nextPost && (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="flex-1 group p-4 rounded-lg border border-gray-700 hover:border-blue-500/50 bg-gray-800/50 transition-all text-right"
          >
            <div className="text-sm text-gray-400 mb-2 flex items-center justify-end">
              Sonraki Yazı
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-white group-hover:text-blue-400 transition-colors">
              {nextPost.title}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
} 