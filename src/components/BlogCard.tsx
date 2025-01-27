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
    <div className="border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-gray-800">
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-bold mb-2 text-white hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-gray-300 mb-2">{post.summary}</p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>Kategori: {post.category}</span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
} 