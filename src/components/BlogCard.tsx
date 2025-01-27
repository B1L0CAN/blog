import { Post } from '@/types/post';
import Link from 'next/link';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="group border border-gray-700 rounded-lg p-6 bg-gray-800 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 hover:border-blue-500/50">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
              <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            
            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
            
            <p className="text-gray-300 mb-4 line-clamp-2">
              {post.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </div>
            
            <div className="text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
              Devamını Oku
              <span className="ml-1 group-hover:ml-2 transition-all">→</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 