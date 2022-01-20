<template>
  <div class="scrolling-wrapper">
        <div class="row">
          <div class="col-4">
            <div class="input-group mb-3 mt-3">
          <input type="text" class="form-control" v-model="cardName" placeholder="nouvelle carte" />
          <div class="input-group-append"><button class="btn btn-primary btnn" @click="newCard"><font-awesome-icon icon="plus"/></button>
          </div>
        </div>
          </div>
        </div>
    
    <div class="row">
      <div class="col">
        <draggable
      :list="this.lists"
      :handle="getDragHandle"
      :disabled="!shouldAllowListOrder"
      group="kanban-board"
      @start="drag=true"
      @end="drag=false"
      class="row flex-nowrap mt-1"
    >
      <List
        v-for="(listItem, index) in lists"
        :key="index"
        :index="index"
        :list="listItem"
        description="Votre description"
        @card-deleted="cardDeleted"
        titre="Votre titre"
      ></List>
    </draggable>
      </div>
    </div>
  </div>
  
</template>

<script>
import List from "@/components/List";
import Draggable from "vuedraggable";
import TaskService from "../services/task.service";
import CardService from "../services/card.service";
export default {
  name: "Board",
  components: {
    List,
    Draggable
  },
  data() {
    return {
      lists: [],
      card:"",
      cardName: ""
    };
  },
  computed: {
    shouldAllowListOrder() {
      return this.isDesktop || this.isTablet;
    },
    getDragHandle() {
      return this.isMobile ? "" : ".heading";
    }
  },
   created() {
    this.fetchAll();
  },
  methods: { 
        /* 
    * Update de la liste après suppression
    */
       cardDeleted() {
      this.fetchAll();
    },
        /* 
    * Creation de nouvelle carte avec son nom
    */
    newCard() {
         let value = {
           name : this.cardName
         }
      CardService.createCard(value).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      this.lists.push({
          name: this.cardName,
          headerColor: "#607d8b",
          items: [
          ]
        },);
        this.fetchAll();
        this.cardName =""
    },

        /* 
    *   Affichage des cartes et item à l'intérieur
    */
 fetchAll() {
   const a = [];
   this.lists = [...a]
         CardService.getAllCards().then(
        (response) => {
          let data = response.data;
          this.lists = [...data]
        },
        (error) => {
          console.log(error);
        }
      );
      TaskService.getAllTasks().then(
        (response) => {
          let data = response.data;
          data.forEach(a => {
            this.lists.forEach(element => {
              element.name === a.card ? element.items.push({
              id: a.id,
                titre: a.titre,
                description: a.description,
                date: a.date,
                actif: a.actif,
                utilisateur: a.utilisateur,
                card: a.card
              }) : "";
            })
          });
        },
        (error) => {
          console.log(error);
        }
      );
    },
   
  },
};
</script>

<style>
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.scrolling-wrapper::-webkit-scrollbar {
  display: none;
}
.btnn {
  background-color: grey;
  color: red;
}
</style>
