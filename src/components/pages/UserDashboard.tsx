import React from 'react';
import { Search, Filter, Clock, Sparkles, FileText, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Chip } from '../ui/Chip';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface UserDashboardProps {
  userName: string;
  onNavigate: (page: string, documentId?: string) => void;
}

export function UserDashboard({ userName, onNavigate }: UserDashboardProps) {
  const recentDocuments = [
    {
      id: '1',
      title: 'Rapport annuel 2024',
      tags: ['Finance', 'Rapport'],
      lastAccess: '2h',
      analyzed: true
    },
    {
      id: '2',
      title: 'Contrat client ABC Corp',
      tags: ['Contrat', 'Juridique'],
      lastAccess: '5h',
      analyzed: true
    },
    {
      id: '3',
      title: 'Présentation stratégie Q1',
      tags: ['Stratégie', 'Présentation'],
      lastAccess: '1j',
      analyzed: false
    },
    {
      id: '4',
      title: 'Politique de sécurité IT',
      tags: ['IT', 'Sécurité'],
      lastAccess: '2j',
      analyzed: true
    }
  ];

  const aiStats = {
    documentsAnalyzed: 124,
    lastSummaryDate: 'Il y a 2 heures',
    keywordsExtracted: 856,
    averageProcessingTime: '3.2s'
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-[#111827] mb-1">Bonjour, {userName}</h1>
        <p className="text-[#6B7280]">Bienvenue dans votre coffre-fort documentaire intelligent</p>
      </div>

      {/* Global search */}
      <Card className="bg-gradient-to-br from-white to-[#F9FAFB]">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher dans vos documents…"
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent"
            />
          </div>
          <Button variant="ghost" className="border border-[#E5E7EB]">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>
      </Card>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent documents - takes 2 columns on desktop */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1D4ED8]" />
                <h3 className="text-[#111827]">Documents récents</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('documents')}
              >
                Voir tout
              </Button>
            </div>

            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onNavigate('document-detail', doc.id)}
                  className="p-4 rounded-lg border border-[#E5E7EB] hover:border-[#1D4ED8] hover:bg-[#F9FAFB] cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#1D4ED8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#111827] text-sm mb-1 truncate">{doc.title}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {doc.tags.map((tag, i) => (
                            <Chip key={i} variant="secondary">{tag}</Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {doc.analyzed && (
                        <Badge variant="success" size="sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Analysé
                        </Badge>
                      )}
                      <span className="text-xs text-[#9CA3AF]">{doc.lastAccess}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Activity */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" />
              <h3 className="text-[#111827]">Activité IA</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#DBEAFE] to-[#CFFAFE]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#0891B2]">Documents analysés</span>
                  <TrendingUp className="w-4 h-4 text-[#0891B2]" />
                </div>
                <div className="text-2xl text-[#1D4ED8] mb-1">{aiStats.documentsAnalyzed}</div>
                <div className="text-xs text-[#0891B2]">+12 cette semaine</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-xs text-[#6B7280]">Dernière analyse</span>
                  <span className="text-xs text-[#111827]">{aiStats.lastSummaryDate}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-xs text-[#6B7280]">Mots-clés extraits</span>
                  <span className="text-xs text-[#111827]">{aiStats.keywordsExtracted}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[#6B7280]">Temps moyen</span>
                  <span className="text-xs text-[#111827]">{aiStats.averageProcessingTime}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] text-white">
            <Sparkles className="w-8 h-8 mb-3 opacity-90" />
            <h4 className="mb-2">IA locale</h4>
            <p className="text-sm opacity-90 mb-4">
              Tous vos documents sont analysés localement, garantissant une confidentialité totale.
            </p>
            <Badge variant="neutral" size="sm" className="bg-white/20 text-white border-white/30">
              Model: local-llm-v1
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}