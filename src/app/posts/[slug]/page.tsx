'use client';

import { posts } from '@/data/posts';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import TableOfContents from '@/components/TableOfContents';
import PostNavigation from '@/components/PostNavigation';
import CopyButton from '@/components/CopyButton';
import { useEffect, useRef } from 'react';
import { use } from 'react';
import { Components } from 'react-markdown';
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import SocialLinks from '@/components/SocialLinks';
import ScrollToTop from '@/components/ScrollToTop';

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ImageProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

function highlightText(text: string, query: string) {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <span key={i} className="bg-yellow-500/20 text-yellow-200">{part}</span> : 
      part
  );
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const highlightQuery = searchParams.get('highlight') || '';
  const contentRef = useRef<HTMLDivElement>(null);

  const post = posts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    if (highlightQuery && contentRef.current) {
      const content = contentRef.current;
      const regex = new RegExp(highlightQuery, 'gi');
      const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            return regex.test(node.textContent || '')
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          }
        }
      );

      const firstMatch = walker.nextNode();
      if (firstMatch) {
        firstMatch.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightQuery]);

  const components: Components = {
    code: ({ node, inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <div className="relative">
            <CopyButton code={code} />
            <code className={className} {...props}>
              {children}
            </code>
          </div>
        );
      }
      
      if (inline) {
        return (
          <code className={className} {...props}>
            {highlightText(String(children), highlightQuery)}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => {
      if (typeof children === 'string') {
        return <p>{highlightText(children, highlightQuery)}</p>;
      }
      return <p>{children}</p>;
    },
    h1: ({ children }) => {
      if (typeof children === 'string') {
        const id = children
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        return <h1 id={id}>{highlightText(children, highlightQuery)}</h1>;
      }
      return <h1>{children}</h1>;
    },
    h2: ({ children }) => {
      if (typeof children === 'string') {
        const id = children
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        return <h2 id={id}>{highlightText(children, highlightQuery)}</h2>;
      }
      return <h2>{children}</h2>;
    },
    h3: ({ children }) => {
      if (typeof children === 'string') {
        const id = children
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        return <h3 id={id}>{highlightText(children, highlightQuery)}</h3>;
      }
      return <h3>{children}</h3>;
    },
    h4: ({ children }) => {
      if (typeof children === 'string') {
        const id = children
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        return <h4 id={id}>{highlightText(children, highlightQuery)}</h4>;
      }
      return <h4>{children}</h4>;
    },
    h5: ({ children }) => {
      if (typeof children === 'string') {
        const id = children
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        return <h5 id={id}>{highlightText(children, highlightQuery)}</h5>;
      }
      return <h5>{children}</h5>;
    },
    img: (props: ImageProps) => {
      if (!props.src) return null;

      const { src, width, height, style, className, alt, ...rest } = props;

      return (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          margin: '2rem 0'
        }}>
          <img
            src={src}
            style={{
              width: width ? `${width}px` : 'auto',
              height: height ? `${height}px` : 'auto',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
            alt={alt ?? ''}
            {...rest}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Başlık */}
      <header className="w-full py-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1 text-center mb-4 md:mb-0">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                <h1 className="text-5xl font-bold text-white">
                  Bilo&apos;nun Not Defteri
                </h1>
              </Link>
            </div>
            <div className="md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2">
              <SocialLinks />
            </div>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto py-8 px-4 md:px-8 flex-1">
        <Link href="/" className="text-blue-400 hover:underline mb-4 block">
          ← Ana Sayfaya Dön
        </Link>
        <h2 className="text-3xl font-bold mb-4 text-white">
          {highlightText(post.title, highlightQuery)}
        </h2>
        <div className="flex items-center gap-4 text-gray-400 mb-8">
          <span>Kategori: {highlightText(post.category, highlightQuery)}</span>
          <span>•</span>
          <span>{formattedDate}</span>
        </div>
        
        <TableOfContents content={post.content} />
        
        <div ref={contentRef} className="prose prose-invert prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-headings:text-white prose-a:text-blue-400 max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }]]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <PostNavigation currentPost={post} />
      </article>

      <ScrollToTop />
    </div>
  );
} 