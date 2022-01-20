<template>
  <div class="card">
    <div class="card-body">
      <!-- Display Item Markup Start -->
      <div v-show="!isEditing">
        <h3>
          {{ item.titre
          }}<span :class="item.actif == true ? 'red' : 'green'"></span>
        </h3>
        <p class="text-style disable-select">{{ item.description }}</p>
        <p class="text-style2 disable-select">{{ item.date }}</p>
        <!-- Drag Handle for mobiles -->
        <div class="drag-handle" v-if="shouldUseDragHandle">
          <svg style="width: 15px; height: 15px" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"
            ></path>
          </svg>
        </div>
        <!-- Edit Icon -->
        <div class="edit-icon" @click.prevent="handleEdit">
          <svg style="width: 15px; height: 15px" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M20.71,4.04C21.1,3.65 21.1,3 20.71,2.63L18.37,0.29C18,-0.1 17.35,-0.1 16.96,0.29L15,2.25L18.75,6M17.75,7L14,3.25L4,13.25V17H7.75L17.75,7Z"
            ></path>
          </svg>
        </div>

        <div class="delete-icon" @click.prevent="handleDelete">
          <font-awesome-icon icon="times" />
        </div>
      </div>
      <!-- Display Item Markup End -->
      <!-- Form Markup Start -->
      <div v-show="isEditing" class="form">
        <div class="form-group row mb-3 mt-3">
          <label for="staticEmail" class="col-sm-3 col-form-label">Titre</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" v-model="form.titre" />
          </div>
        </div>
        <div class="form-group row mb-3 mt-3">
          <label for="staticEmail" class="col-sm-3 col-form-label"
            >Status</label
          >
          <div class="col-sm-9">
            <select
              class="form-control"
              id="exampleFormControlSelect1"
              v-model="form.status"
            >
              <option :value="false">En cours</option>
              <option :value="true">Terminée</option>
            </select>
          </div>
        </div>
        <div class="form-group mb-2">
          <textarea
            rows="3"
            class="form-control"
            v-model="form.description"
          ></textarea>
        </div>
        <div class="form-group text-center">
          <button
            class="btn btn-outline-primary btn-sm mr-2"
            @click.prevent="save"
          >
            Sauvegarder
          </button>
          <button
            class="btn btn-outline-secondary btn-sm"
            @click.prevent="cancel"
          >
            Annuler
          </button>
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
  props: ["item"],
  data() {
    return {
      form: {
        id: "",
        description: "",
        titre: "",
        status: false,
      },
      isEditing: false,
    };
  },
  computed: {
    shouldUseDragHandle() {
      return this.isDesktop ? false : true;
    },
  },
  methods: {
    handleEdit() {
      this.form.id = this.item.id;
      this.form.description = this.item.description;
      this.form.titre = this.item.titre;
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
      };
      this.clearForm();
      this.isEditing = false;
      this.$emit("item-edited", item);

      let taskData = {
        titre: item.titre,
        description: item.description,
        actif: this.form.status,
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

<style scope>
.card {
  min-height: 50px;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.9);
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.85) !important;
}
.card-body {
  padding: 1rem !important;
}
.card:hover {
  background: rgba(0, 0, 0, 0.02);
}
.card:hover div.edit-icon {
  display: block;
}

.edit-icon {
  position: absolute;
  bottom: 10px;
  right: 15px;
  display: none;
  cursor: pointer;
}

.card:hover div.delete-icon {
  display: block;
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 15px;
  display: none;
  cursor: pointer;
}
span.text-style {
  white-space: normal;

  padding-left: 10px;
}

.drag-handle {
  position: absolute;
  top: 15px;
  left: 7px;
  margin-right: 5px;
  cursor: pointer;
}

.disable-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.red {
  background-color: red;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-left: 15px;
  display: inline-block;
}
.green {
  background-color: greenyellow;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-left: 15px;
  display: inline-block;
}
.text-style2 {
  font-size: 12px;
  right: 12px;
  position: absolute;
  bottom: 0;
}
</style>
