<template>
    <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 class="text-2xl font-bold text-white">Historique des actions</h2>
                <p class="text-indigo-200 mt-1">Suivi de toutes les modifications</p>
            </div>
            
            <div class="p-6">
                <div v-if="historics.length === 0" class="text-center py-8 text-gray-500">
                    <div class="text-4xl mb-2">📋</div>
                    <p>Aucun historique disponible</p>
                </div>
                
                <div v-else class="space-y-3">
                    <div 
                        v-for="historic in historics" 
                        :key="historic.id"
                        class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <h4 class="font-semibold text-gray-800">{{historic.titre}}</h4>
                                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span class="flex items-center">
                                        👤 {{historic.utilisateur}}
                                    </span>
                                    <span class="flex items-center">
                                        🏷️ {{historic.type}}
                                    </span>
                                </div>
                            </div>
                            <div 
                                class="px-3 py-1 rounded-full text-xs font-medium"
                                :class="getTypeColor(historic.type)"
                            >
                                {{historic.type}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import HistoricService from "../services/historic.service";
export default {
    data() {
        return {
            historics: [
            ]
        };
    },
       created() {
    this.fetchAll();
  },
    methods: {
        fetchAll() {
         HistoricService.getAllHistorics().then(
        (response) => {
          let data = response.data;
          this.historics = [...data]
        },
        (error) => {
          console.log(error);
        }
      );
    },
    getTypeColor(type) {
        switch(type) {
            case 'Creation':
                return 'bg-green-100 text-green-800';
            case 'Modification':
                return 'bg-blue-100 text-blue-800';
            case 'Suppression':
                return 'bg-red-100 text-red-800';
            case 'Suppression carte':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
    }
};
</script>
