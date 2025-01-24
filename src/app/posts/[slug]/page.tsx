import { posts } from '@/data/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { ComponentPropsWithoutRef } from 'react';

type CodeProps = ComponentPropsWithoutRef<'code'>;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Başlık */}
      <header className="w-full py-6 border-b border-gray-800">
        <h1 className="text-4xl font-bold text-white text-center">
          Bilo&apos;nun Not Defteri
        </h1>
      </header>

      <article className="max-w-3xl mx-auto py-8 px-4 flex-1">
        <Link href="/" className="text-blue-400 hover:underline mb-4 block">
          ← Ana Sayfaya Dön
        </Link>
        <h2 className="text-3xl font-bold mb-4 text-white">{post.title}</h2>
        <div className="flex items-center gap-4 text-gray-400 mb-8">
          <span>Kategori: {post.category}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
        <div className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-headings:text-white prose-a:text-blue-400 max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              code: function Code({ className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <pre className="not-prose">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
} 