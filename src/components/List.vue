<template>
  <div class="flex-shrink-0 w-80 bg-slate-100 rounded-2xl shadow-lg overflow-hidden border border-slate-200">
    <!-- Column Header -->
    <div class="p-4" :style="{ backgroundColor: this.list.headerColor || '#4f46e5' }">
      <div v-show="!isUpdate">
        <div class="flex items-center justify-between">
          <h4 class="text-white font-bold text-lg cursor-pointer hover:text-indigo-100 transition-colors drop-shadow-sm" @click="showForm">
            {{ this.list.name }}
          </h4>
          <div class="flex items-center space-x-2">
            <button
              @click="filterCard"
              class="bg-white/20 hover:bg-white/30 text-white transition-all py-3 px-4 rounded-xl border border-white/20 shadow-md hover:shadow-lg"
              title="Trier les cartes"
            >
              <font-awesome-icon icon="filter" style="width:18px; height:18px;" />
            </button>
            <button
              @click="deleteCard()"
              class="bg-rose-500/80 hover:bg-rose-600 text-white transition-all py-3 px-4 rounded-xl border border-rose-400/40 shadow-md hover:shadow-lg"
              title="Supprimer la colonne"
            >
              <font-awesome-icon icon="times" style="width:18px; height:18px;" />
            </button>
          </div>
        </div>
      </div>
      <div v-show="isUpdate">
        <div class="flex space-x-2">
          <input 
            type="text" 
            class="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-gray-800" 
            v-model="title" 
            placeholder="Nom de la colonne"
          />
          <button
            class="bg-white text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-all shadow-sm"
            type="button"
            @click.prevent="updateCa"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
    
    <!-- Cards Container -->
    <div class="p-3 min-h-96 max-h-screen overflow-y-auto bg-gray-50" :data-type="this.list.name">
      <draggable
        :list="list.items"
        :handle="shouldUseDragHandle"
        :disabled="isEditing"
        group="kanban"
        @change="onDragChange"
        class="space-y-3"
      >
        <CardEdit
          v-for="item in this.list.items"
          :item="item"
          :key="item.id"
          :availableCards="availableCards"
          @item-edited="itemEdited"
          @item-cancelled="itemCancelled"
          @item-editing="itemEditing"
          @item-deleted="itemDeleted"
          @refresh-board="refreshBoard"
        ></CardEdit>
      </draggable>
      <CardNew
        class="mt-3"
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
  props: ["list", "titre", "description", "index", "allLists"],

  data() {
    return {
      isEditing: false,
      isUpdate: false,
      title: this.list.name,
      deviceIsMobile: false,
      deviceIsDesktop: true,
      deviceIsTablet: false
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
      return this.deviceIsDesktop ? "" : ".drag-handle";
    },
    availableCards() {
      if (this.allLists && this.allLists.length > 0) {
        return this.allLists.map(list => list.name);
      }
      return [this.list.name];
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
    // Persist when a task is dropped into this column
    onDragChange(evt) {
      if (!evt.added) return;

      const draggedElement = evt.added.element;
      if (!draggedElement || !draggedElement.id) {
        console.error("Impossible de trouver l'élément déplacé");
        return;
      }

      const newCard = this.list.name;
      draggedElement.card = newCard;

      TaskService.editTask(draggedElement.id, { card: newCard }).then(
        () => {},
        (error) => {
          console.error("Erreur lors du déplacement:", error);
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
      if (itm) {
        itm.titre = item.titre;
        itm.description = item.description;
        itm.actif = item.actif;
        itm.card = item.card;
      }

      // Move card to another column immediately in the UI
      if (item.card !== this.list.name) {
        this.list.items = this.list.items.filter((t) => t.id !== item.id);
        const targetList = (this.allLists || []).find((l) => l.name === item.card);
        if (targetList) {
          if (!Array.isArray(targetList.items)) {
            this.$set(targetList, "items", []);
          }
          const alreadyThere = targetList.items.some((t) => t.id === item.id);
          if (!alreadyThere) {
            targetList.items.push({
              id: item.id,
              titre: item.titre,
              description: item.description,
              actif: item.actif,
              card: item.card,
              date: itm ? itm.date : item.date,
              utilisateur: itm ? itm.utilisateur : item.utilisateur,
            });
          }
        }
      }

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
    },
    manageCollaborators() {
      // Naviguer vers la page des collaborateurs pour ce kanban
      if (this.list.id || this.list._id) {
        this.$router.push(`/kanban/${this.list.id || this.list._id}/collaborators`);
      }
    },
    refreshBoard() {
      this.$emit('refresh-board');
    }
  },
};
</script>

<style>
</style>
