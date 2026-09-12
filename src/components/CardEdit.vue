<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative group">
    <!-- Display Item -->
    <div v-show="!isEditing">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-800 text-lg flex items-center">
          {{ item.titre }}
          <span 
            :class="item.actif == true ? 'bg-green-500' : 'bg-yellow-500'" 
            class="ml-2 w-3 h-3 rounded-full"
          ></span>
        </h3>
        <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.prevent="handleEdit"
            class="text-indigo-600 hover:text-indigo-800 py-2.5 px-3.5 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-indigo-200"
            title="Modifier"
          >
            <font-awesome-icon icon="edit" style="width:16px; height:16px;" />
          </button>
          <button
            @click.prevent="handleDelete"
            class="text-red-600 hover:text-red-800 py-2.5 px-3.5 rounded-lg hover:bg-red-50 transition-all shadow-sm hover:shadow-md border border-transparent hover:border-red-200"
            title="Supprimer"
          >
            <font-awesome-icon icon="times" style="width:16px; height:16px;" />
          </button>
        </div>
      </div>
      
      <p class="text-gray-600 text-sm mb-2 line-clamp-3">{{ item.description }}</p>
      
      <div class="flex items-center justify-between text-xs text-gray-400">
        <span>{{ item.date }}</span>
        <span v-if="item.utilisateur" class="flex items-center">
          <font-awesome-icon icon="user" class="mr-1" />
          {{ item.utilisateur }}
        </span>
      </div>
      
      <!-- Drag Handle for mobiles -->
      <div class="drag-handle absolute top-2 left-2 cursor-grab active:cursor-grabbing" v-if="shouldUseDragHandle">
        <svg style="width: 16px; height: 16px" viewBox="0 0 24 24">
          <path
            fill="#6b7280"
            d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"
          ></path>
        </svg>
      </div>
    </div>
    
    <!-- Edit Form -->
    <div v-show="isEditing" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
        <input 
          type="text" 
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 placeholder-opacity-70" 
          v-model="form.titre" 
          placeholder="Titre de la tâche"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
        <select
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          v-model="form.status"
        >
          <option :value="false">En cours</option>
          <option :value="true">Terminée</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Carte</label>
        <select
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          v-model="form.card"
        >
          <option v-for="card in availableCards" :key="card" :value="card">{{ card }}</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows="3"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 placeholder-opacity-70"
          v-model="form.description"
          placeholder="Description de la tâche"
        ></textarea>
      </div>
      
      <div class="flex space-x-3 pt-1">
        <button
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          @click.prevent="save"
        >
          Sauvegarder
        </button>
        <button
          class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-300/60"
          @click.prevent="cancel"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TaskService from "../services/task.service";
import HistoricService from "../services/historic.service";
export default {
  props: ["item", "availableCards"],
  data() {
    return {
      form: {
        id: "",
        description: "",
        titre: "",
        status: false,
        card: "",
      },
      isEditing: false,
      deviceIsMobile: false,
      deviceIsDesktop: true,
      deviceIsTablet: false
    };
  },
  computed: {
    shouldUseDragHandle() {
      return this.deviceIsDesktop ? false : true;
    },
  },
  created() {
    this.detectDevice();
    window.addEventListener('resize', this.detectDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.detectDevice);
  },
  methods: {
    detectDevice() {
      const width = window.innerWidth;
      this.deviceIsMobile = width < 768;
      this.deviceIsTablet = width >= 768 && width < 1024;
      this.deviceIsDesktop = width >= 1024;
    },
    handleEdit() {
      this.form.id = this.item.id;
      this.form.description = this.item.description;
      this.form.titre = this.item.titre;
      this.form.card = this.item.card;
      this.form.status = this.item.actif === true;
      this.isEditing = true;
      this.$emit("item-editing");
    },
    /*
     * Suppression d'un item dans un carte et ajout de l'historique
     */
    handleDelete() {
      let historicData = {
        titre: this.item.titre,
        type: "Suppression",
        utilisateur: this.$store.state.auth.user.username,
      };
      HistoricService.createHistoric(historicData).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      TaskService.deleteTask(this.item.id).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.$emit("item-deleted", this.item.id);
    },
    clearForm() {
      this.form.id = "";
      this.form.description = "";
      this.form.titre = "";
      this.form.card = "";
    },
    /*
     * Sauvegarde de la modification du carte
     */
    save() {
      let item = {
        id: this.form.id,
        description: this.form.description,
        titre: this.form.titre,
        actif: this.form.status,
        card: this.form.card,
      };

      let taskData = {
        titre: item.titre,
        description: item.description,
        actif: this.form.status,
        card: item.card,
      };
      let historicData = {
        titre: item.titre,
        type: "Modification",
        utilisateur: this.$store.state.auth.user.username, //this.task.utilisateur,
      };
      
      HistoricService.createHistoric(historicData).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );

      TaskService.editTask(this.item.id, taskData).then(
        (response) => {
          console.log(response);
          this.clearForm();
          this.isEditing = false;
          this.$emit("item-edited", item);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    cancel() {
      this.clearForm();
      this.isEditing = false;
      this.$emit("item-cancelled");
    },
  },
};
</script>

<style>
</style>
