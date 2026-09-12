<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">
            Gérer les collaborateurs
          </h1>
          <button 
            @click="goBack"
            class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            ← Retour
          </button>
        </div>

        <div v-if="kanban" class="mb-6">
          <h2 class="text-lg font-semibold text-gray-700">Kanban: {{ kanban.name }}</h2>
          <p class="text-sm text-gray-500">Propriétaire: {{ kanban.owner && kanban.owner.username ? kanban.owner.username : 'Inconnu' }}</p>
        </div>

        <div class="mb-8">
          <h3 class="text-md font-semibold text-gray-700 mb-3">Ajouter un collaborateur</h3>
          <div class="flex space-x-3">
            <input
              v-model="searchQuery"
              @input="searchUsers"
              type="text"
              class="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-800"
              placeholder="Rechercher par nom ou email..."
            />
            <button
              @click="addSelectedCollaborator"
              :disabled="!selectedUser"
              class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all border border-indigo-500/20 text-sm"
            >
              Ajouter
            </button>
          </div>

          <div v-if="searchResults.length > 0" class="mt-3 bg-white rounded-xl border border-gray-200 shadow-md max-h-48 overflow-y-auto">
            <div
              v-for="user in searchResults"
              :key="user._id || user.id"
              @click="selectUser(user)"
              :class="selectedUser && (selectedUser._id || selectedUser.id) === (user._id || user.id) ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'"
              class="px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-gray-800">{{ user.username }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ user.email }})</span>
                </div>
                <font-awesome-icon 
                  v-if="selectedUser && (selectedUser._id || selectedUser.id) === (user._id || user.id)" 
                  icon="check" 
                  class="text-indigo-600 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-md font-semibold text-gray-700 mb-3">Collaborateurs actuels</h3>
          <div v-if="collaborators.length > 0" class="space-y-2">
            <div
              v-for="collaborator in collaborators"
              :key="collaborator._id || collaborator.id"
              class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                  {{ collaborator.username && collaborator.username.charAt(0) ? collaborator.username.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div>
                  <div class="font-bold text-gray-800">{{ collaborator.username }}</div>
                  <div class="text-xs text-gray-500">{{ collaborator.email }}</div>
                </div>
              </div>
              <button
                @click="removeCollaborator(collaborator)"
                class="bg-rose-100 hover:bg-rose-200 text-rose-700 hover:text-rose-900 font-semibold px-3 py-1.5 rounded-xl border border-rose-200/80 transition-all text-xs flex items-center space-x-1 shadow-sm"
                title="Supprimer"
              >
                <font-awesome-icon icon="times" class="mr-1" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
            Aucun collaborateur pour ce kanban
          </div>
        </div>

        <div v-if="message" class="mt-4 p-3 rounded-lg text-sm" :class="messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KanbanService from '../services/kanban.service';

export default {
  name: 'Collaborators',
  data() {
    return {
      kanban: null,
      collaborators: [],
      searchQuery: '',
      searchResults: [],
      selectedUser: null,
      message: '',
      messageType: 'success',
      searchTimeout: null
    };
  },
  created() {
    this.loadKanban();
    this.loadCollaborators();
  },
  methods: {
    loadKanban() {
      const kanbanId = this.$route.params.id;
      console.log('loadKanban - kanbanId:', kanbanId);
      KanbanService.getKanbanById(kanbanId).then(
        response => {
          this.kanban = response.data;
          console.log('Kanban chargé:', this.kanban);
        },
        error => {
          console.error('Erreur lors du chargement du kanban:', error);
          this.showMessage('Erreur lors du chargement du kanban', 'error');
        }
      );
    },
    loadCollaborators() {
      const kanbanId = this.$route.params.id;
      console.log('loadCollaborators - kanbanId:', kanbanId);
      KanbanService.getCollaborators(kanbanId).then(
        response => {
          this.collaborators = response.data;
          console.log('Collaborateurs chargés:', this.collaborators);
        },
        error => {
          console.error('Erreur lors du chargement des collaborateurs:', error);
        }
      );
    },
    searchUsers() {
      clearTimeout(this.searchTimeout);
      
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }

      this.searchTimeout = setTimeout(() => {
        KanbanService.searchUsers(this.searchQuery).then(
          response => {
            //filter user if already a colab
            const collaboratorIds = this.collaborators.map(c => c.id || c._id);
            this.searchResults = response.data.filter(user => 
              !collaboratorIds.includes(user.id || user._id) && 
              (user.id || user._id) !== (this.kanban && this.kanban.owner)
            );
          },
          error => {
            console.error('Erreur lors de la recherche:', error);
            this.searchResults = [];
          }
        );
      }, 300);
    },
    selectUser(user) {
      this.selectedUser = user;
      console.log('Utilisateur sélectionné:', user);
    },
    addSelectedCollaborator() {
      if (!this.selectedUser) return;

      const kanbanId = this.$route.params.id;
      const userId = this.selectedUser.id || this.selectedUser._id;
      
      console.log('addSelectedCollaborator - kanbanId:', kanbanId, 'userId:', userId);
      
      KanbanService.addCollaborator(kanbanId, userId).then(
        response => {
          console.log('Collaborateur ajouté avec succès:', response.data);
          this.showMessage('Collaborateur ajouté avec succès', 'success');
          this.selectedUser = null;
          this.searchQuery = '';
          this.searchResults = [];
          this.loadCollaborators();
        },
        error => {
          console.error('Erreur lors de l\'ajout du collaborateur:', error);
          this.showMessage('Erreur lors de l\'ajout du collaborateur', 'error');
        }
      );
    },
    removeCollaborator(collaborator) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) return;

      const kanbanId = this.$route.params.id;
      const collaboratorId = typeof collaborator === 'object' ? (collaborator._id || collaborator.id) : collaborator;
      
      console.log('removeCollaborator - kanbanId:', kanbanId, 'collaborator:', collaborator, 'collaboratorId:', collaboratorId);
      
      if (!collaboratorId || collaboratorId === 'undefined') {
        console.error('ID collaborateur invalide:', collaborator);
        this.showMessage('ID collaborateur invalide', 'error');
        return;
      }
      
      KanbanService.removeCollaborator(kanbanId, collaboratorId).then(
        response => {
          console.log('Collaborateur supprimé avec succès:', response.data);
          this.showMessage('Collaborateur supprimé avec succès', 'success');
          this.loadCollaborators();
        },
        error => {
          console.error('Erreur lors de la suppression du collaborateur:', error);
          this.showMessage(error.response?.data?.message || 'Erreur lors de la suppression du collaborateur', 'error');
        }
      );
    },
    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
</style>
