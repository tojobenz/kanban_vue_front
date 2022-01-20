<template>
  <div class="col list-width">
    <div class="heading" :style="{ backgroundColor: this.list.headerColor }">
      <div v-show="!isUpdate">
        <h4 class="text-center">
          <span @click="showForm">{{ this.list.name }}</span
          ><font-awesome-icon icon="filter" style="width:20px; height:20px; margin-left: 20px" @click="filterCard" />
          <span class="croix"
            ><font-awesome-icon icon="times" @click="deleteCard()"
          /></span>
        </h4>
      </div>
      <div v-show="isUpdate">
        <div class="input-group mb-3">
          <input type="text" class="form-control" v-model="title" />
          <div class="input-group-append">
            <button
              class="btn btn-primary"
              type="button"
              @click.prevent="updateCa"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="cards cards-list" :data-type="this.list.name">
      <draggable
        :list="this.list.items"
        :handle="shouldUseDragHandle"
        :disabled="isEditing"
        :key="key"
        group="kanban"
        @start="drag = true"
        @end="drag = false"
        :move="DragChange"
      >
        <CardEdit
          v-for="item in this.list.items"
          :item="item"
          :key="item.id"
          @item-edited="itemEdited"
          @item-cancelled="itemCancelled"
          @item-editing="itemEditing"
          @item-deleted="itemDeleted"
        ></CardEdit>
      </draggable>
      <CardNew
        class="fixed-card"
        :item="defaultItem"
        :index="this.index"
        :name="this.list.name"
        @item-creating="itemCreating"
        @item-created="itemCreated"
        @item-cancelled="itemCancelled"
      ></CardNew>
    </div>
  </div>
</template>

<script>
import CardNew from "@/components/CardNew";
import CardEdit from "@/components/CardEdit";
import Draggable from "vuedraggable";
import TaskService from "../services/task.service";
import cardService from "../services/card.service";
import HistoricService from "../services/historic.service";
export default {
  components: {
    CardNew,
    CardEdit,
    Draggable,
  },
  props: ["list", "titre", "description", "index"],

  data() {
    return {
      isEditing: false,
      key: "",
      isUpdate: false,
      title: this.list.name,
    };
  },

  computed: {
    defaultItem() {
      console.log(this.index);
      return {
        id: 0,
        titre: this.titre,
        description: this.description,
        ind: this.index,
      };
    },
    shouldUseDragHandle() {
      return this.isDesktop ? "" : ".drag-handle";
    },
  },

  methods: {
    //Drag d'item vers une autre carte
    DragChange(evt) {
      let id = evt.draggedContext.element.id;
      let value = {
        actif: false,
        card: evt.to.parentElement.dataset.type,
      };

      TaskService.editTask(id, value).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    itemEditing() {
      this.isEditing = true;
    },
    itemDeleting() {
      this.isDeleting = true;
    },
    itemEdited(item) {
      const itm = this.list.items.find((t) => t.id == item.id);
      itm.list = item.list;
      itm.titre = item.titre;
      itm.description = item.description;
      itm.actif = item.actif;

      this.isEditing = false;
    },
    itemDeleted(item) {
      const deleteObj = (data, column, search) => {
        let result = data.filter((m) => m[column] !== search);

        return result;
      };
      let deleted = deleteObj(this.list.items, "id", item);
      this.list.items = [...deleted];
    },
    itemCreating() {
      this.isEditing = true;
    },
    itemCreated(item) {
      this.list.items.push(item);
      this.isEditing = false;
    },
    itemCancelled() {
      this.isEditing = false;
    },

    //Suppression et ajout de l'historique
    deleteCard() {
      let historicData = {
        titre: this.list.name,
        utilisateur: this.$store.state.auth.user.username,
        type: "Suppression carte",
      };
      HistoricService.createHistoric(historicData).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      cardService.deleteCard(this.list.id).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.$emit("card-deleted");
    },
    showForm() {
      this.isUpdate = true;
    },

    //Modification du nom de carte
    updateCa() {
      let value = {
        name: this.title,
      };
      let card = {
        card: this.title,
      };
      cardService.editCard(this.list.id, value).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      TaskService.editTaskCard(this.list.name, card).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.list.name = value.name;
      this.isUpdate = false;
    },
    filterCard() {
this.list.items.sort().reverse();
return this.list.items
    }
  },
};
</script>

<style>
.col-3 {
  padding: 0 !important;
  margin: 0 15px;
}
.heading {
  padding: 10px 10px;
  color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.cards-list {
  min-height: 300px;
  height: 100vh;
  overflow: scroll;
  box-shadow: 1px 1px 1px 0px rgba(158, 158, 158, 0.25);
  background-color: rgba(223, 238, 242, 0.4);
}

.fixed-card {
  color: #ccc;
  border: 1px dotted #ccc;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.list-width {
  min-width: 10%;
  max-width: 10%;
  border-radius: 10px;
}
.croix {
  float: right;
}
</style>
