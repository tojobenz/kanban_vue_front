<template>
  <div class="space-y-6">
    <!-- Kanban Header with Help Information -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ boardTitle }}</h1>
          <p class="text-gray-600 mb-4">Gérez vos projets de manière efficace avec ce tableau Kanban interactif</p>
          
          <!-- Help Section -->
          <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
            <h3 class="font-semibold text-indigo-800 mb-2">Comment utiliser ce tableau :</h3>
            <ul class="text-sm text-indigo-700 space-y-1">
              <li>• <strong>Créer une colonne</strong> : Entrez un nom et cliquez sur le bouton +</li>
              <li>• <strong>Ajouter une tâche</strong> : Cliquez sur "Nouveau tâche" dans une colonne</li>
              <li>• <strong>Déplacer les tâches</strong> : Glissez-déposez les tâches entre les colonnes</li>
              <li>• <strong>Modifier/Supprimer</strong> : Utilisez les icônes d'édition et de suppression</li>
              <li>• <strong>Suivi des actions</strong> : Consultez l'historique pour voir toutes les modifications</li>
              <li>• <strong>Gérer les collaborateurs</strong> : Allez dans votre profil pour ajouter des collaborateurs</li>
            </ul>
          </div>
        </div>
        
        <!-- User Info -->
        <div class="ml-4 text-right">
          <div class="text-sm text-gray-500">Utilisateur connecté</div>
          <div class="font-semibold text-indigo-600">{{ currentUser && currentUser.username ? currentUser.username : 'Invité' }}</div>
        </div>
      </div>
    </div>

    <!-- New Card Input -->
    <div class="bg-white rounded-2xl shadow-md p-5 border border-indigo-100" v-if="!currentKanbanId">
      <div class="flex space-x-3">
        <input 
          type="text" 
          class="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 placeholder-opacity-70 text-gray-800" 
          v-model="cardName" 
          placeholder="Nom de la nouvelle colonne..." 
        />
        <button 
          class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-7 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2 border border-indigo-500/20"
          @click="newCard"
        >
          <font-awesome-icon icon="plus" class="text-base" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
    
    <!-- Kanban Info -->
    <div v-if="currentKanbanId && currentKanban" class="bg-white rounded-2xl shadow-md p-5 mb-4 border border-indigo-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ currentKanban.name }}</h2>
          <p class="text-sm font-medium text-indigo-600 mt-1">Propriétaire: {{ currentKanban.owner && currentKanban.owner.username ? currentKanban.owner.username : 'Inconnu' }}</p>
        </div>
        <button 
          @click="goToAllKanbans"
          class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-1 border border-indigo-200"
        >
          <span>← Retour à tous les kanbans</span>
        </button>
      </div>
    </div>
    
    <!-- Kanban Board -->
    <div class="overflow-x-auto pb-4">
      <draggable
        :list="this.lists"
        :handle="getDragHandle"
        :disabled="!shouldAllowListOrder"
        group="kanban-board"
        @start="drag=true"
        @end="drag=false"
        class="flex space-x-4 min-w-max"
      >
        <List
          v-for="(listItem, index) in lists"
          :key="index"
          :index="index"
          :list="listItem"
          :allLists="lists"
          description="Description de la tâche"
          @card-deleted="cardDeleted"
          @refresh-board="fetchAll"
          titre="Titre de la tâche"
        ></List>
      </draggable>
    </div>
  </div>
</template>

<script>
import List from "@/components/List";
import Draggable from "vuedraggable";
import TaskService from "../services/task.service";
import CardService from "../services/card.service";
import KanbanService from "../services/kanban.service";
import CollaboratorService from "../services/collaborator.service";

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
      cardName: "",
      deviceIsMobile: false,
      deviceIsDesktop: true,
      deviceIsTablet: false,
      currentKanbanId: null,
      currentKanban: null,
      ownerUsername: ''
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    targetOwnerId() {
      return this.$route.query.owner || null;
    },
    boardTitle() {
      if (this.targetOwnerId && this.ownerUsername) {
        return `Tableau Kanban de ${this.ownerUsername}`;
      }
      return "Mon Tableau Kanban";
    },
    shouldAllowListOrder() {
      return this.deviceIsDesktop || this.deviceIsTablet;
    },
    getDragHandle() {
      return this.deviceIsMobile ? "" : ".heading";
    }
  },
  created() {
    this.currentKanbanId = this.$route.params.id || null;
    if (this.currentKanbanId) {
      this.loadKanban();
    }
    this.loadOwnerInfo();
    this.fetchAll();
    this.detectDevice();
    window.addEventListener('resize', this.detectDevice);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.detectDevice);
  },
  watch: {
    '$route'(to) {
      this.currentKanbanId = to.params.id || null;
      if (this.currentKanbanId) {
        this.loadKanban();
      } else {
        this.currentKanban = null;
      }
      this.loadOwnerInfo();
      this.fetchAll();
    }
  },
  methods: { 
    detectDevice() {
      const width = window.innerWidth;
      this.deviceIsMobile = width < 768;
      this.deviceIsTablet = width >= 768 && width < 1024;
      this.deviceIsDesktop = width >= 1024;
    },
    cardDeleted() {
      this.fetchAll();
    },
    loadOwnerInfo() {
      if (this.targetOwnerId) {
        CollaboratorService.getInviters().then(
          response => {
            const inviters = response.data || [];
            const inviter = inviters.find(u => (u._id || u.id) === this.targetOwnerId);
            if (inviter) {
              this.ownerUsername = inviter.username;
            } else {
              this.ownerUsername = '';
            }
          },
          () => {
            this.ownerUsername = '';
          }
        );
      } else {
        this.ownerUsername = '';
      }
    },
    newCard() {
      if (!this.cardName || this.cardName.trim() === "") {
        alert("Veuillez entrer un nom pour la carte");
        return;
      }
      
      let value = {
        name: this.cardName,
        owner: this.targetOwnerId
      };

      CardService.createCard(value).then(
        (response) => {
          console.log('Carte créée:', response.data);
          this.cardName = "";
          this.fetchAll();
        },
        (error) => {
          console.error(error);
          alert("Erreur lors de la création de la carte: " + (error.response?.data?.message || error.message));
        }
      );
    },
    loadKanban() {
      const kanbanId = this.$route.params.id;
      KanbanService.getKanbanById(kanbanId).then(
        response => {
          this.currentKanban = response.data;
        },
        error => {
          console.error('Erreur lors du chargement du kanban:', error);
        }
      );
    },
    goToAllKanbans() {
      this.$router.push('/home');
    },
    async fetchAll() {
      try {
        const cardsResponse = await CardService.getAllCards(this.targetOwnerId);
        let cards = cardsResponse.data || [];

        if (this.currentKanbanId) {
          cards = cards.filter((card) => card._id === this.currentKanbanId);
        }

        const tasksResponse = await TaskService.getAllTasks();
        const tasks = tasksResponse.data || [];

        // Build lists with items in one assignment so Vue 2 tracks reactivity
        this.lists = cards.map((card) => ({
          ...card,
          items: tasks
            .filter((task) => task.card === card.name)
            .map((task) => ({
              id: task.id,
              titre: task.titre,
              description: task.description,
              date: task.date,
              actif: task.actif,
              utilisateur: task.utilisateur,
              card: task.card,
            })),
        }));
      } catch (error) {
        console.log("Erreur chargement du tableau:", error);
      }
    }
  }
};
</script>

<style>
</style>
