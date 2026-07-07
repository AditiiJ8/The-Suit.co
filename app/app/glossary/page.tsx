'use client';

import { useState, useMemo } from 'react';
import { glossaryTerms } from '@/lib/mockData';
import { Search } from 'lucide-react';

const categories = ['All', ...new Set(glossaryTerms.map((t) => t.category))];

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="text-gold font-serif text-lg mb-2">Legal Definitions</p>
        <h2 className="font-serif text-3xl font-bold">Legal Glossary</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search legal terms..."
          className="w-full bg-card border border-gold text-foreground placeholder-muted-foreground px-4 py-4 pl-12 rounded-sm focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-gold text-gold-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} found
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((term, idx) => (
          <div
            key={idx}
            className="bg-card border border-border rounded-sm p-5 hover:border-gold transition-colors card-hover h-full"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-serif font-bold text-lg text-foreground">
                {term.term}
              </h3>
              <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-sm flex-shrink-0 ml-2">
                {term.category}
              </span>
            </div>

            <p className="text-foreground leading-relaxed mb-4 text-sm">
              {term.definition}
            </p>

            {term.example && (
              <div className="bg-secondary/50 border border-border rounded-sm p-3 text-xs text-muted-foreground italic leading-relaxed">
                <span className="font-medium text-foreground block mb-1">Example:</span>
                {term.example}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No terms found matching your search.</p>
          <p className="text-xs mt-2">Try adjusting your search term or category filter.</p>
        </div>
      )}
    </div>
  );
}
