import React, { useState } from 'react';
import { Search, Filter, Sparkles, FileText, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface SearchPageProps {
  onNavigate: (page: string, documentId?: string) => void;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchResults = [
    {
      id: '1',
      title: 'Rapport annuel 2024',
      snippet: 'Ce rapport annuel présente une analyse complète des performances financières... croissance de 23%...',
      tags: ['Finance', 'Rapport'],
      createdAt: '2024-01-15',
      relevance: 95,
      aiKeywords: ['Croissance', 'Performance', 'Finance']
    },
    {
      id: '2',
      title: 'Budget prévisionnel 2024-2025',
      snippet: '...allocation budgétaire pour les différents départements... projection financière...',
      tags: ['Finance', 'Budget'],
      createdAt: '2024-02-10',
      relevance: 87,
      aiKeywords: ['Budget', 'Prévision', 'Allocation']
    },
    {
      id: '3',
      title: 'Présentation stratégie Q1',
      snippet: '...orientations stratégiques pour le premier trimestre... objectifs de croissance...',
      tags: ['Stratégie', 'Présentation'],
      createdAt: '2024-02-01',
      relevance: 78,
      aiKeywords: ['Stratégie', 'Objectifs', 'Trimestre']
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchPerformed(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#111827] mb-2">Recherche intelligente</h1>
        <p className="text-[#6B7280]">Recherchez dans vos documents avec l'aide de l'IA</p>
      </div>

      {/* Search box */}
      <Card className="bg-gradient-to-br from-white to-[#F9FAFB]">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher par titre, contenu, mots-clés IA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-14 pr-4 py-4 rounded-lg border-2 border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent text-base"
              />
            </div>
            <Button variant="primary" size="lg" onClick={handleSearch}>
              <Search className="w-5 h-5" />
              Rechercher
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[#6B7280]">Suggestions:</span>
            <button className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
              croissance
            </button>
            <button className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
              contrat
            </button>
            <button className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
              stratégie 2024
            </button>
            <button className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-[#6B7280] hover:bg-[#E5E7EB] transition-colors">
              budget
            </button>
          </div>
        </div>
      </Card>

      {/* AI Info */}
      <Card className="bg-gradient-to-br from-[#DBEAFE] to-[#CFFAFE] border-[#93C5FD]">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[#1D4ED8] text-sm mb-1">Recherche alimentée par l'IA</h4>
            <p className="text-xs text-[#0891B2]">
              Notre IA locale analyse le contenu et les métadonnées pour vous fournir les résultats les plus pertinents.
            </p>
          </div>
        </div>
      </Card>

      {/* Results */}
      {searchPerformed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#111827]">
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
            </h3>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>

          {searchResults.map((result) => (
            <Card 
              key={result.id}
              className="hover:border-[#1D4ED8] cursor-pointer transition-all"
              onClick={() => onNavigate('document-detail', result.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#DBEAFE] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#1D4ED8]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[#111827]">{result.title}</h3>
                    <Badge variant="primary" size="sm">
                      {result.relevance}% pertinent
                    </Badge>
                  </div>

                  <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
                    {result.snippet}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(result.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.tags.map((tag, i) => (
                        <Chip key={i} variant="secondary">{tag}</Chip>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span className="text-xs text-[#6B7280]">Mots-clés IA:</span>
                    </div>
                    {result.aiKeywords.map((keyword, i) => (
                      <span key={i} className="text-xs text-[#06B6D4]">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <h3 className="text-[#111827] mb-2">Commencez votre recherche</h3>
            <p className="text-sm text-[#6B7280]">
              Utilisez la barre de recherche ci-dessus pour trouver vos documents
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
