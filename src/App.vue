<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav class="bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 shadow-xl border-b border-indigo-500/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 py-3">
          <div class="flex items-center space-x-6">
            <router-link to="/home" class="text-white font-extrabold text-2xl tracking-wide hover:text-indigo-200 transition-colors flex items-center">
              <font-awesome-icon icon="columns" class="mr-2.5 text-indigo-300" />
              Tableau Kanban
            </router-link>
            <div class="flex items-center space-x-3" v-if="currentUser">
              <router-link 
                to="/home" 
                exact-active-class="bg-white/25 border-white/40 shadow-inner"
                class="text-white bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 transition-all shadow-sm flex items-center text-sm"
              >
                <font-awesome-icon icon="home" class="mr-2 text-indigo-200" />
                Accueil
              </router-link>
              <!-- Kanbans des utilisateurs qui ont ajouté cet utilisateur -->
              <router-link 
                v-for="inviter in inviters" 
                :key="inviter._id || inviter.id"
                :to="{ path: '/home', query: { owner: inviter._id || inviter.id } }"
                active-class="bg-amber-500/35 border-amber-300 text-white shadow-inner"
                class="text-amber-100 bg-amber-500/20 hover:bg-amber-500/30 hover:text-white font-semibold px-4 py-2 rounded-xl backdrop-blur-md border border-amber-400/30 transition-all shadow-sm flex items-center text-sm"
              >
                <font-awesome-icon icon="user" class="mr-2 text-amber-300" />
                Kanban de {{ inviter.username }}
              </router-link>
            </div>
          </div>

          <div v-if="!currentUser" class="flex space-x-3">
            <router-link to="/register" class="text-white bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all text-sm flex items-center">
              <font-awesome-icon icon="user-plus" class="mr-2" />
              Créer un compte
            </router-link>
            <router-link to="/login" class="text-white bg-indigo-500 hover:bg-indigo-600 font-semibold px-5 py-2 rounded-xl shadow-md transition-all text-sm flex items-center">
              <font-awesome-icon icon="sign-in-alt" class="mr-2" />
              Connexion
            </router-link>
          </div>

          <div v-if="currentUser" class="flex items-center space-x-3">
            <router-link to="/profile" class="text-white bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all text-sm flex items-center">
              <font-awesome-icon icon="cog" class="mr-2 text-indigo-200" />
              Profil
            </router-link>
            <router-link to="/historic" class="text-white bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 rounded-xl border border-white/20 transition-all text-sm flex items-center">
              <font-awesome-icon icon="history" class="mr-2 text-indigo-200" />
              Historique
            </router-link>
            <a class="text-rose-100 bg-rose-500/20 hover:bg-rose-600/40 font-semibold px-4 py-2 rounded-xl border border-rose-400/30 transition-all text-sm flex items-center cursor-pointer" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt" class="mr-2 text-rose-300" />
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </div>
  </div>
</template>

<script>
import CollaboratorService from './services/collaborator.service';

export default {
  data() {
    return {
      inviters: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  created() {
    if (this.currentUser) {
      this.loadInviters();
    }
  },
  watch: {
    currentUser(newVal) {
      if (newVal) {
        this.loadInviters();
      } else {
        this.inviters = [];
      }
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    loadInviters() {
      CollaboratorService.getInviters().then(
        response => {
          this.inviters = response.data || [];
        },
        error => {
          console.error('Erreur lors du chargement des utilisateurs invitants:', error);
        }
      );
    }
  }
};
</script>
<style scoped>
</style>