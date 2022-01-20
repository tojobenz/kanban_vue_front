<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="txtc">email</label>
          <input
            v-model="user.email"
            v-validate="'required'"
            type="text"
            class="form-control inp"
            name="email"
          />
          <div
            v-if="errors.has('email')"
            class="alert alert-danger"
            role="alert"
          >Le champ email est requis</div>
        </div>
        <div class="form-group">
          <label for="mot" class="txtc">Mot de passe</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="form-control inp"
            name="password"
          />
          <div
            v-if="errors.has('password')"
            class="alert alert-danger"
            role="alert"
          >Le champ mot de passe est requis</div>
        </div>
        <div class="form-group mt-3 mb-3">
          <button class="btn btn-primary btn-block btnd" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Se connecter</span>
          </button>
        </div>
        <div class="form-group">
          <div @click="signup"><a href="">Créer un compte</a></div>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
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
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
  border-radius: 15px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.btnd {
  width: 100%;
  background-color: rgb(101, 60, 248);
}
.inp {
  border: rgb(145, 122, 231) 1px solid;
}
.txtc {
  color: rgb(101, 60, 248);
  font-weight: 600;
}
</style>