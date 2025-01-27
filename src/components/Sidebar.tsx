'use client';
import { posts } from '@/data/posts';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Sidebar() {
  // Benzersiz kategorileri al
  const categories = Array.from(new Set(posts.map(post => post.category)));
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 p-6 text-gray-100">
      <div className="mb-6">
        <SearchBar />
      </div>
      <h2 className="text-xl font-bold mb-4 text-white">Kategoriler</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category} className="border-b border-gray-700">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center justify-between w-full py-2 text-left hover:text-blue-400 transition-colors"
            >
              <span className="font-semibold">{category}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  openCategory === category ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 ${
                openCategory === category
                  ? 'max-h-96 opacity-100 py-2'
                  : 'max-h-0 opacity-0'
              }`}
            >
              {posts
                .filter(post => post.category === category)
                .map(post => (
                  <li key={post.id} className="pl-4 py-1">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
} 