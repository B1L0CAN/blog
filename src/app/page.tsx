import BlogCard from '@/components/BlogCard';
import Sidebar from '@/components/Sidebar';
import { posts } from '@/data/posts';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Başlık */}
      <header className="w-full py-6 border-b border-gray-800">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          <h1 className="text-4xl font-bold text-white text-center">
            Bilo&apos;nun Not Defteri
          </h1>
        </Link>
      </header>

      {/* Giriş Yazısı */}
      <div className="w-full py-8 px-4 border-b border-gray-800">
        <p className="max-w-4xl mx-auto text-gray-300 text-center text-lg italic">
          Merhaba, bu blog Android ve Kotlin konusunda kişisel not defterim gibi kullanılacaktır. 
          Bir şey öğrenmek isteyen ilgili konuların dökümantasyonuna bakabilir. 
          Amerikayı yeniden keşfetmeye gerek yok :)
        </p>
      </div>

      {/* İçerik */}
      <div className="flex flex-1 relative">
        {/* Sol Sidebar */}
        <Sidebar />
        
        {/* Ana İçerik */}
        <main className="flex-1 p-4 md:p-8">
          <h2 className="text-2xl font-semibold mb-8 text-white">Blog Yazıları</h2>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
