'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Markdown içeriğinden başlıkları çıkar
    const lines = content.split('\n');
    const headings: Heading[] = [];
    
    lines.forEach((line) => {
      // ## veya ### ile başlayan satırları bul
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // # sayısı
        const text = match[2];
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        headings.push({ id, text, level });
      }
    });

    setHeadings(headings);
  }, [content]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="bg-gray-800 p-4 rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4 text-white">İçindekiler</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              marginLeft: `${(heading.level - 2) * 1.5}rem`,
            }}
          >
            <a
              href={`#${heading.id}`}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
} 