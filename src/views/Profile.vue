<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <font-awesome-icon icon="user" class="text-3xl text-indigo-600" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">{{currentUser.username}}</h2>
            <p class="text-indigo-200">Profil utilisateur</p>
          </div>
        </div>
      </div>
      
      <div class="p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500 mb-1">ID Utilisateur</p>
            <p class="font-semibold text-gray-800">{{currentUser.id}}</p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500 mb-1">Email</p>
            <p class="font-semibold text-gray-800">{{currentUser.email}}</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-500 mb-2">Rôles</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(role,index) in currentUser.roles" 
              :key="index"
              class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {{role}}
            </span>
          </div>
        </div>

        <div class="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h3 class="text-lg font-semibold text-indigo-800 mb-4">
            <font-awesome-icon icon="users" class="mr-2" />
            Gérer les collaborateurs
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Ajouter un collaborateur par email</label>
              <div class="flex space-x-3">
                <input
                  v-model="collaboratorEmail"
                  type="email"
                  class="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-800"
                  placeholder="email@exemple.com"
                />
                <button
                  @click="addCollaboratorByEmail"
                  :disabled="!collaboratorEmail || loading"
                  class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all border border-indigo-500/20 text-sm"
                >
                  <span v-if="loading">Ajout...</span>
                  <span v-else>Ajouter</span>
                </button>
              </div>
            </div>

            <div v-if="userCollaborators.length > 0">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Collaborateurs existants</h4>
              <div class="space-y-2">
                <div
                  v-for="collab in userCollaborators"
                  :key="collab._id || collab.id"
                  class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm"
                >
                  <div class="flex items-center">
                    <div class="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm shadow-sm">
                      {{ collab.username && collab.username.charAt(0) ? collab.username.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    <div>
                      <div class="font-bold text-gray-800 text-sm">{{ collab.username }}</div>
                      <div class="text-xs text-gray-500">{{ collab.email }}</div>
                    </div>
                  </div>
                  <button
                    @click="removeCollaborator(collab._id || collab.id)"
                    class="bg-rose-100 hover:bg-rose-200 text-rose-700 hover:text-rose-900 font-semibold px-3 py-1.5 rounded-xl border border-rose-200/80 transition-all text-xs flex items-center space-x-1 shadow-sm"
                    title="Supprimer"
                  >
                    <font-awesome-icon icon="times" class="mr-1" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-sm bg-white rounded-lg p-4 border border-gray-200">
              Aucun collaborateur ajouté
            </div>
          </div>

          <!-- Messages -->
          <div v-if="message" class="mt-4 p-3 rounded-lg text-sm" :class="messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CollaboratorService from '../services/collaborator.service';

export default {
  name: 'Profile',
  data() {
    return {
      collaboratorEmail: '',
      userCollaborators: [],
      loading: false,
      message: '',
      messageType: 'success'
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    } else {
      this.loadUserCollaborators();
    }
  },
  methods: {
    loadUserCollaborators() {
      CollaboratorService.getCollaborators().then(
        response => {
          this.userCollaborators = response.data;
        },
        error => {
          console.error('Erreur lors du chargement des collaborateurs:', error);
        }
      );
    },
    addCollaboratorByEmail() {
      if (!this.collaboratorEmail || !this.isValidEmail(this.collaboratorEmail)) {
        this.showMessage('Veuillez entrer une adresse email valide', 'error');
        return;
      }

      this.loading = true;

      CollaboratorService.addCollaborator(this.collaboratorEmail).then(
        response => {
          this.userCollaborators = response.data;
          this.collaboratorEmail = '';
          this.showMessage('Collaborateur ajouté avec succès', 'success');
          this.loading = false;
        },
        error => {
          console.error('Erreur lors de l\'ajout du collaborateur:', error);
          this.showMessage(error.response?.data?.message || 'Erreur lors de l\'ajout du collaborateur', 'error');
          this.loading = false;
        }
      );
    },
    removeCollaborator(collaboratorId) {
      if (!collaboratorId || collaboratorId === 'undefined') {
        console.error('ID collaborateur invalide:', collaboratorId);
        this.showMessage('ID collaborateur invalide', 'error');
        return;
      }

      if (!confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) return;

      CollaboratorService.removeCollaborator(collaboratorId).then(
        response => {
          this.userCollaborators = response.data;
          this.showMessage('Collaborateur supprimé avec succès', 'success');
        },
        error => {
          console.error('Erreur lors de la suppression du collaborateur:', error);
          this.showMessage(error.response?.data?.message || 'Erreur lors de la suppression du collaborateur', 'error');
        }
      );
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    showMessage(msg, type) {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>