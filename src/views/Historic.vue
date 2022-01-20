<template>
    <div class="container">
        <h3 class="p-3 text-center">Liste des historiques</h3>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Utilisateur</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="historic in historics" :key="historic.id">
                    <td>{{historic.titre}}</td>
                    <td>{{historic.utilisateur}}</td>
                    <td>{{historic.type}}</td>
                </tr>
            </tbody>
        </table>
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
    }
};
</script>
