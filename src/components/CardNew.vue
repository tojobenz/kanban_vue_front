<template>
  <div class="card" v-if="!isFormShowing" @click.prevent="handleNew">
    <div class="card-body">
      <!-- New Item Link Markup Start -->
      <div class="text-center text-dark">
        <span>
          <svg style="width:15px;height:15px" viewBox="0 0 24 24">
            <path fill="#000000" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path>
          </svg>
          <strong>Nouveau tâche</strong>
        </span>
      </div>
    </div>
  </div>
  <div class="card" v-else>
    <div class="card-body">
      <!-- Item Display Markup End -->
      <!-- Form Markup Start -->
      <div class="form">
               <div class="form-group row mb-3 mt-3">
    <label for="staticEmail" class="col-sm-3 col-form-label">Titre</label>
    <div class="col-sm-9">
<input type="text" class="form-control" v-model="form.titre">   </div>
  </div>
  
  <div class="form-group row mb-3 mt-3">
    <label for="staticEmail" class="col-sm-3 col-form-label">Status</label>
    <div class="col-sm-9">
<select class="form-control" id="exampleFormControlSelect1" v-model="form.status">
      <option :value="false">En cours</option>
      <option :value="true">Terminée</option>
    </select>    </div>
  </div>
        <div class="form-group mb-3">
          <textarea rows="3" class="form-control" v-model="form.description"></textarea>
        </div>
        <div class="form-group text-center">
          <button class="btn btn-outline-primary btn-sm mr-2" @click.prevent="save">Sauvegarder</button>
          <button class="btn btn-outline-secondary btn-sm mr-3" @click.prevent="cancel">Annuler</button>
        </div>
      </div>
      <!-- Form Markup End -->
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

<style scope>
</style>

