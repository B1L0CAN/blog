import BlogCard from '@/components/BlogCard';
import Sidebar from '@/components/Sidebar';
import { posts } from '@/data/posts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Başlık */}
      <header className="w-full py-6 border-b border-gray-800">
        <h1 className="text-4xl font-bold text-white text-center">
          Bilo&apos;nun Not Defteri
        </h1>
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
      <div className="flex flex-1">
        {/* Sol Sidebar */}
        <Sidebar />
        
        {/* Ana İçerik */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-8 text-white">Blog Yazıları</h2>
          <div className="grid gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
