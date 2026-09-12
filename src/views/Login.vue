<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-200"
          alt="Profile"
        />
        <h2 class="text-3xl font-bold text-gray-800">Connexion</h2>
        <p class="text-gray-600 mt-2">Accédez à votre tableau Kanban</p>
      </div>
      
      <form name="form" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="user.email"
            v-validate="'required'"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70"
            name="email"
            placeholder="votre@email.com"
          />
          <div
            v-if="errors.has('email')"
            class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded"
          >Le champ email est requis</div>
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70"
            name="password"
            placeholder="••••••••"
          />
          <div
            v-if="errors.has('password')"
            class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded"
          >Le champ mot de passe est requis</div>
        </div>
        
        <div>
          <button 
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 text-base border border-indigo-500/20" 
            :disabled="loading"
          >
            <span v-show="loading" class="animate-spin">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
          </button>
        </div>
        
        <div class="text-center">
          <button 
            type="button"
            @click="signup" 
            class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Créer un compte
          </button>
        </div>
        
        <div v-if="message" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {{ message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.email && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/home');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },
    signup() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
</style>