import React from 'react';
import { FileText, Sparkles, Users, Clock, Upload, UserCog, Shield, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = {
    totalDocuments: 1247,
    analyzedDocuments: 892,
    totalUsers: 48,
    activeTemporaryAccess: 12
  };

  const recentDocuments = [
    {
      id: '1',
      title: 'Rapport mensuel Janvier 2024',
      owner: 'Marie Martin',
      createdAt: '2024-02-15T09:30:00',
      visibility: 'ROLE_BASED'
    },
    {
      id: '2',
      title: 'Contrat partenariat Tech Corp',
      owner: 'Pierre Durand',
      createdAt: '2024-02-14T16:20:00',
      visibility: 'PRIVATE'
    },
    {
      id: '3',
      title: 'Procédure onboarding 2024',
      owner: 'Sophie Laurent',
      createdAt: '2024-02-14T11:45:00',
      visibility: 'PUBLIC'
    },
    {
      id: '4',
      title: 'Budget IT Q1 2024',
      owner: 'Jean Dupont',
      createdAt: '2024-02-13T14:15:00',
      visibility: 'ROLE_BASED'
    }
  ];

  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      PRIVATE: { label: 'Privé', variant: 'error' as const },
      ROLE_BASED: { label: 'Par rôle', variant: 'warning' as const },
      PUBLIC: { label: 'Public', variant: 'success' as const }
    };
    return variants[visibility as keyof typeof variants];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#111827] mb-2">Administration</h1>
        <p className="text-[#6B7280]">Vue d'ensemble et gestion du système</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1D4ED8]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
          <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-[#1D4ED8]" />
              </div>
              <Badge variant="primary" size="sm">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15%
                </span>
              </Badge>
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{stats.totalDocuments.toLocaleString()}</div>
            <div className="text-sm text-[#6B7280] font-medium">Total documents</div>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#10B981]">
              <ArrowUpRight className="w-3 h-3" />
              <span>+234 ce mois</span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#06B6D4]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
          <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#CFFAFE] to-[#A5F3FC] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-[#06B6D4]" />
            </div>
            <Badge variant="secondary" size="sm">72%</Badge>
          </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{stats.analyzedDocuments.toLocaleString()}</div>
            <div className="text-sm text-[#6B7280] font-medium">Documents analysés</div>
            <div className="mt-3 w-full bg-[#E5E7EB] rounded-full h-2">
              <div className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
          <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-[#10B981]" />
              </div>
              <Badge variant="success" size="sm">
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +3
                </span>
              </Badge>
            </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-[#6B7280] font-medium">Utilisateurs</div>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#10B981]">
              <ArrowUpRight className="w-3 h-3" />
              <span>3 nouveaux cette semaine</span>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F59E0B]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
          <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <Badge variant="warning" size="sm">Actifs</Badge>
          </div>
            <div className="text-3xl font-bold text-[#111827] mb-1">{stats.activeTemporaryAccess}</div>
            <div className="text-sm text-[#6B7280] font-medium">Accès temporaires</div>
            <div className="mt-3 flex items-center gap-1 text-xs text-[#F59E0B]">
              <Clock className="w-3 h-3" />
              <span>5 expirent bientôt</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="bg-gradient-to-br from-white to-[#F9FAFB]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#111827] mb-1">Actions rapides</h3>
            <p className="text-sm text-[#6B7280]">Accès rapide aux fonctionnalités principales</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="primary"
            className="justify-start h-auto py-4 px-5 group hover:shadow-md transition-all duration-300"
            onClick={() => onNavigate('admin-documents')}
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Téléverser un document</div>
              <div className="text-xs opacity-90">Ajouter un nouveau fichier</div>
            </div>
          </Button>
          <Button 
            variant="ghost"
            className="justify-start h-auto py-4 px-5 border border-[#E5E7EB] hover:border-[#1D4ED8] hover:bg-[#F0F9FF] transition-all duration-300 group"
            onClick={() => onNavigate('admin-users')}
          >
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#BFDBFE] transition-colors">
              <UserCog className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-[#111827]">Gérer les utilisateurs</div>
              <div className="text-xs text-[#6B7280]">Administrer les comptes</div>
            </div>
          </Button>
          <Button 
            variant="ghost"
            className="justify-start h-auto py-4 px-5 border border-[#E5E7EB] hover:border-[#1D4ED8] hover:bg-[#F0F9FF] transition-all duration-300 group"
            onClick={() => onNavigate('admin-permissions-general')}
          >
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center mr-3 group-hover:bg-[#BFDBFE] transition-colors">
              <Shield className="w-5 h-5 text-[#1D4ED8]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-[#111827]">Gérer les permissions</div>
              <div className="text-xs text-[#6B7280]">Contrôler les accès</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Recent documents */}
      <Card padding="none">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h3 className="text-[#111827]">Derniers documents ajoutés</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('admin-documents')}
            >
              Voir tout
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-12 px-6 font-semibold text-[#6B7280]">Titre</TableHead>
                <TableHead className="h-12 px-6 font-semibold text-[#6B7280]">Propriétaire</TableHead>
                <TableHead className="h-12 px-6 font-semibold text-[#6B7280]">Date</TableHead>
                <TableHead className="h-12 px-6 font-semibold text-[#6B7280]">Visibilité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDocuments.map((doc) => {
                const visBadge = getVisibilityBadge(doc.visibility);
                return (
                  <TableRow key={doc.id} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#1D4ED8]" />
                        </div>
                        <div className="text-sm font-medium text-[#111827]">{doc.title}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm text-[#6B7280]">{doc.owner}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-medium text-[#111827]">
                        {new Date(doc.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">
                        {new Date(doc.createdAt).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant={visBadge.variant} size="sm">
                        {visBadge.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {recentDocuments.map((doc) => {
            const visBadge = getVisibilityBadge(doc.visibility);
            return (
              <div key={doc.id} className="p-4">
                <div className="text-sm text-[#111827] mb-1">{doc.title}</div>
                <div className="text-xs text-[#6B7280] mb-2">{doc.owner}</div>
                <div className="flex items-center gap-2">
                  <Badge variant={visBadge.variant} size="sm">
                    {visBadge.label}
                  </Badge>
                  <span className="text-xs text-[#9CA3AF]">
                    {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
