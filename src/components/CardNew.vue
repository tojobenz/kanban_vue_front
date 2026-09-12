<template>
  <div 
    class="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all" 
    v-if="!isFormShowing" 
    @click.prevent="handleNew"
  >
    <div class="text-center text-gray-500 hover:text-indigo-600 transition-colors">
      <div class="flex items-center justify-center space-x-2">
        <font-awesome-icon icon="plus" class="text-lg" />
        <span class="font-medium">Nouvelle tâche</span>
      </div>
    </div>
  </div>
  
  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4" v-else>
    <div class="space-y-3">
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
  props: ["item", "index", "name"],
  data() {
    return {
      form: {
        id: "",
        titre: "",
        description: "",
        card: "",
        status: false
      },
      isFormShowing: false
    };
  },
  methods: {
    /* 
    * Creation de l'item à l'interieur du carte
    */
    handleNew(e) {
      this.form.id = this.item.id;
      this.form.description = this.item.description;
      this.form.titre = this.item.titre;
      this.isFormShowing = true;
      this.$emit("item-creating");
    },
    clearForm() {
      this.form.text = "";
    },
    getRandomId() {
      const min = 1000;
      const max = 5000;
      const id = Math.floor(Math.random() * (max - min + 1)) + min;
      return id;
    },
    save() {
      const item = { id: this.form.id, titre: this.form.titre, description: this.form.description };
      this.clearForm();
      this.isFormShowing = false;
      this.$emit("item-created", item);
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
       let taskData = {
        titre: this.form.titre,
        date: dateTime, //this.task.date,
        description: this.form.description,
        actif: this.form.status,
        utilisateur: this.$store.state.auth.user.username,//this.task.utilisateur,
        card: this.name,
      };
      let historicData = {
        titre: this.form.titre,
        utilisateur: this.$store.state.auth.user.username,//this.task.utilisateur,
        type: "Creation",
      };
       HistoricService.createHistoric(historicData).then(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
               TaskService.createTask(taskData).then(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
    },
    cancel() {
      this.clearForm();
      this.isFormShowing = false;
      this.$emit("item-cancelled");
    }
  }
};
</script>

<style>
</style>

