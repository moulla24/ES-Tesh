import React, { useState } from 'react';
import { UserCog, Edit2, X, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface AdminUsersProps {
  onNavigate: (page: string) => void;
}

export function AdminUsers({ onNavigate }: AdminUsersProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const users = [
    {
      id: '1',
      displayName: 'Jean Dupont',
      email: 'jean.dupont@entreprise.fr',
      role: 'ADMIN',
      origin: 'LOCAL',
      status: 'active',
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      displayName: 'Marie Martin',
      email: 'marie.martin@entreprise.fr',
      role: 'USER',
      origin: 'SSO',
      status: 'active',
      createdAt: '2023-08-20'
    },
    {
      id: '3',
      displayName: 'Pierre Durand',
      email: 'pierre.durand@entreprise.fr',
      role: 'USER',
      origin: 'LOCAL',
      status: 'active',
      createdAt: '2023-09-10'
    },
    {
      id: '4',
      displayName: 'Sophie Laurent',
      email: 'sophie.laurent@entreprise.fr',
      role: 'ADMIN',
      origin: 'SSO',
      status: 'active',
      createdAt: '2023-07-05'
    },
    {
      id: '5',
      displayName: 'Marc Bernard',
      email: 'marc.bernard@entreprise.fr',
      role: 'USER',
      origin: 'LOCAL',
      status: 'inactive',
      createdAt: '2023-05-12'
    }
  ];

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('admin')}
            className="text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
        <h1 className="text-[#111827] mb-2">Gestion des utilisateurs</h1>
        <p className="text-[#6B7280]">Gérez les utilisateurs et leurs rôles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="text-2xl text-[#111827] mb-1">
            {users.length}
          </div>
          <div className="text-xs text-[#6B7280]">Total utilisateurs</div>
        </Card>
        <Card padding="sm">
          <div className="text-2xl text-[#111827] mb-1">
            {users.filter(u => u.role === 'ADMIN').length}
          </div>
          <div className="text-xs text-[#6B7280]">Administrateurs</div>
        </Card>
        <Card padding="sm">
          <div className="text-2xl text-[#111827] mb-1">
            {users.filter(u => u.status === 'active').length}
          </div>
          <div className="text-xs text-[#6B7280]">Actifs</div>
        </Card>
      </div>

      {/* Users table */}
      <Card padding="none" className="overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-xs text-[#6B7280]">Nom</th>
                <th className="text-left px-6 py-4 text-xs text-[#6B7280]">Email</th>
                <th className="text-left px-6 py-4 text-xs text-[#6B7280]">Rôle</th>
                <th className="text-left px-6 py-4 text-xs text-[#6B7280]">Statut</th>
                <th className="text-left px-6 py-4 text-xs text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">
                          {user.displayName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-[#111827]">{user.displayName}</div>
                        <div className="text-xs text-[#6B7280]">
                          Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#6B7280]">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'ADMIN' ? 'primary' : 'neutral'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {users.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] rounded-full flex items-center justify-center">
                    <span className="text-white">
                      {user.displayName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-[#111827] mb-1">{user.displayName}</div>
                    <div className="text-xs text-[#6B7280]">{user.email}</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={user.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'active' ? 'success' : 'neutral'} size="sm">
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                className="w-full border border-[#E5E7EB]"
                onClick={() => handleEditUser(user)}
              >
                <Edit2 className="w-4 h-4" />
                Modifier
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit user modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2.5xl my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserCog className="w-6 h-6 text-[#1D4ED8]" />
                <h2 className="text-[#111827]">Modifier l'utilisateur</h2>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-[#6B7280] hover:text-[#111827] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User info header */}
              <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1D4ED8] to-[#06B6D4] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-medium">
                    {selectedUser.displayName.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-[#111827] mb-1">{selectedUser.displayName}</div>
                  <div className="text-sm text-[#6B7280]">{selectedUser.email}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={selectedUser.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                      {selectedUser.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Edit form */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[#374151] mb-3 block">Rôle</label>
                  <Select
                    options={[
                      { value: 'USER', label: 'USER - Utilisateur standard' },
                      { value: 'ADMIN', label: 'ADMIN - Administrateur' }
                    ]}
                    defaultValue={selectedUser.role}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#374151] mb-3 block">Statut</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="status" 
                        value="active"
                        defaultChecked={selectedUser.status === 'active'}
                        className="w-4 h-4 text-[#1D4ED8] border-[#E5E7EB] focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 cursor-pointer"
                      />
                      <span className="text-sm text-[#111827] group-hover:text-[#1D4ED8] transition-colors">Actif</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="status" 
                        value="inactive"
                        defaultChecked={selectedUser.status === 'inactive'}
                        className="w-4 h-4 text-[#1D4ED8] border-[#E5E7EB] focus:ring-2 focus:ring-[#1D4ED8] focus:ring-offset-2 cursor-pointer"
                      />
                      <span className="text-sm text-[#111827] group-hover:text-[#1D4ED8] transition-colors">Inactif</span>
                    </label>
                  </div>
                </div>

                {/* Info card */}
                {selectedUser.origin === 'SSO' && (
                  <div className="p-4 bg-[#DBEAFE] rounded-lg border border-[#93C5FD]">
                    <p className="text-sm text-[#1E40AF] leading-relaxed">
                      <strong className="font-semibold">Note:</strong> Les utilisateurs SSO ne peuvent pas être supprimés. 
                      Vous pouvez seulement les désactiver ou modifier leur rôle.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement save logic
                    setShowEditModal(false);
                  }}
                >
                  Enregistrer les modifications
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 border border-[#E5E7EB]"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
