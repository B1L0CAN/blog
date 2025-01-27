'use client';
import { posts } from '@/data/posts';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Sidebar() {
  // Benzersiz kategorileri al
  const categories = Array.from(new Set(posts.map(post => post.category)));
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Her kategori için blog sayısını hesapla
  const getCategoryCount = (category: string) => {
    return posts.filter(post => post.category === category).length;
  };

  return (
    <>
      {/* Hamburger menü butonu - sadece mobilde görünür */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 right-4 z-50 p-2 rounded bg-gray-800 text-white md:hidden"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Overlay - mobilde menü açıkken arka planı karartır */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-6 text-gray-100 z-50 transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
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
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{category}</span>
                  <span className="text-sm text-gray-400">({getCategoryCount(category)})</span>
                </div>
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
                        onClick={() => setIsMobileMenuOpen(false)} // Mobilde link tıklandığında menüyü kapat
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
    </>
  );
} 