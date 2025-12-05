import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Link2, Sparkles, Calendar, User, Globe, Lock, Users, FileText, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { apiService } from '../../services/api';

interface DocumentDetailProps {
  documentId: string;
  onNavigate: (page: string) => void;
}

export function DocumentDetail({ documentId, onNavigate }: DocumentDetailProps) {
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string;
    keyPoints: string[];
    model: string;
    analyzedAt: string;
  } | null>(null);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getDocument(documentId);
      if (response.data) {
        setDocument(response.data);
        // Si le document est déjà analysé, charger l'analyse
        if (response.data.analyzed && response.data.analysis) {
          setAiAnalysis({
            summary: response.data.analysis.summary,
            keyPoints: response.data.analysis.key_points || [],
            model: response.data.analysis.model_used || 'local-llm',
            analyzedAt: response.data.analysis.analyzed_at || new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getVisibilityConfig = (visibility: string) => {
    const configs = {
      PRIVATE: { icon: Lock, label: 'Privé', variant: 'error' as const, description: 'Uniquement accessible par vous' },
      ROLE_BASED: { icon: Users, label: 'Par rôle', variant: 'warning' as const, description: 'Accessible selon les rôles' },
      PUBLIC: { icon: Globe, label: 'Public', variant: 'success' as const, description: 'Accessible à tous' }
    };
    return configs[visibility as keyof typeof configs];
  };

  const visConfig = getVisibilityConfig(document.visibility);
  const VisIcon = visConfig.icon;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await apiService.analyzeDocument(documentId);
      if (response.error) {
        console.error('Erreur lors de l\'analyse:', response.error);
        setIsAnalyzing(false);
        return;
      }

      // Polling pour vérifier si l'analyse est terminée
      let attempts = 0;
      const maxAttempts = 30; // 60 secondes max
      
      const checkAnalysis = setInterval(async () => {
        attempts++;
        const docResponse = await apiService.getDocument(documentId);
        
        if (docResponse.data?.analyzed && docResponse.data?.analysis) {
          clearInterval(checkAnalysis);
          setAiAnalysis({
            summary: docResponse.data.analysis.summary,
            keyPoints: docResponse.data.analysis.key_points || [],
            model: docResponse.data.analysis.model_used || 'local-llm',
            analyzedAt: docResponse.data.analysis.analyzed_at || new Date().toISOString()
          });
          setDocument(docResponse.data);
          setIsAnalyzing(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkAnalysis);
          setIsAnalyzing(false);
          console.error('Analyse non terminée après 60 secondes');
        }
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-[#6B7280]">Document introuvable</p>
        </div>
      </div>
    );
  }

  const ownerName = document.owner?.display_name || document.owner?.email || 'Inconnu';
  const tags = document.tags || [];
  const createdAt = document.created_at || document.createdAt;
  const fileSize = document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A';
  const pageCount = document.page_count || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate('documents')}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-[#111827]">{document.title}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Document info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-6">
              {/* Title and visibility */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-[#111827] mb-2">{document.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={visConfig.variant}>
                        <VisIcon className="w-3 h-3 mr-1" />
                        {visConfig.label}
                      </Badge>
                      <span className="text-xs text-[#6B7280]">{visConfig.description}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag: any, i: number) => (
                    <Chip key={i} variant="secondary">{tag}</Chip>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-y border-[#E5E7EB]">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Propriétaire</div>
                    <div className="text-sm text-[#111827]">{ownerName}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Créé le</div>
                    <div className="text-sm text-[#111827]">
                      {new Date(createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      à {new Date(createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Détails du fichier</div>
                    <div className="text-sm text-[#111827]">{fileSize}</div>
                    <div className="text-xs text-[#6B7280]">{pageCount} pages</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Dernière modification</div>
                    <div className="text-sm text-[#111827]">
                      {new Date(createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Snippet */}
              <div>
                <h4 className="text-[#111827] mb-3">Extrait du document</h4>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {document.snippet || 'Aucun extrait disponible'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="primary"
                  onClick={() => window.open(document.file_url || '#', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir dans Mayan
                </Button>
                <Button 
                  variant="ghost"
                  className="border border-[#E5E7EB]"
                  onClick={handleCopyLink}
                >
                  <Link2 className="w-4 h-4" />
                  Copier le lien
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - AI Analysis */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#111827]">Analyse IA</h3>
            </div>

            {!aiAnalysis && !isAnalyzing ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-[#111827] mb-2">Analyse IA disponible</h4>
                  <p className="text-sm text-[#6B7280] mb-6">
                    Cliquez sur le bouton ci-dessous pour générer un résumé automatique et extraire les points clés du document.
                  </p>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleAnalyze}
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyser le document
                  </Button>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[#1D4ED8] animate-spin" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <p className="text-center text-xs text-[#6B7280] mt-4">
                  Analyse en cours...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h4 className="text-[#111827] mb-3">Résumé automatique</h4>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {aiAnalysis.summary}
                  </p>
                </div>

                {/* Key points */}
                <div>
                  <h4 className="text-[#111827] mb-3">Points clés</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiAnalysis.keyPoints.map((point, i) => (
                      <Chip key={i} variant="secondary">{point}</Chip>
                    ))}
                  </div>
                </div>

                {/* Model info */}
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">Model:</span>
                    <Badge variant="neutral" size="sm">{aiAnalysis.model}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-[#6B7280]">Analysé le:</span>
                    <span className="text-[#111827]">
                      {new Date(aiAnalysis.analyzedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Re-analyze button */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full border border-[#E5E7EB]"
                  onClick={handleAnalyze}
                >
                  <Sparkles className="w-4 h-4" />
                  Réanalyser le document
                </Button>
              </div>
            )}
          </Card>

          {/* Info card */}
          <Card className="bg-gradient-to-br from-[#DBEAFE] to-[#CFFAFE] border-[#93C5FD]">
            <Sparkles className="w-6 h-6 text-[#1D4ED8] mb-3" />
            <h4 className="text-[#111827] text-sm mb-2">Analyse locale</h4>
            <p className="text-xs text-[#0891B2]">
              L'analyse est effectuée localement sur votre infrastructure. Aucune donnée n'est envoyée à l'extérieur.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
