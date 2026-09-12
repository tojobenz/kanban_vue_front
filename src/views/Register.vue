<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-200"
          alt="Profile"
        />
        <h2 class="text-3xl font-bold text-gray-800">Créer un compte</h2>
        <p class="text-gray-600 mt-2">Rejoignez votre tableau Kanban</p>
      </div>
      
      <form name="form" @submit.prevent="handleRegister" class="space-y-6">
        <div v-if="!successful">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              v-model="user.username"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70"
              name="username"
              placeholder="votre_nom"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded"
            >{{errors.first('username')}}</div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="user.email"
              v-validate="'required|email|max:50'"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70"
              name="email"
              placeholder="votre@email.com"
            />
            <div
              v-if="submitted && errors.has('email')"
              class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded"
            >{{errors.first('email')}}</div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70"
              name="password"
              placeholder="••••••••"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded"
            >{{errors.first('password')}}</div>
          </div>
          
          <div>
            <button 
              type="submit"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base border border-indigo-500/20"
            >
              S'inscrire
            </button>
          </div>
        </div>
        
        <div class="text-center">
          <button 
            type="button"
            @click="login" 
            class="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Se connecter
          </button>
        </div>
      </form>

      <div
        v-if="message"
        class="mt-4 p-3 rounded-lg text-sm"
        :class="successful ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'"
      >{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message;
              this.successful = true;
            },
            error => {
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
        }
      });
    },
        login() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
</style>