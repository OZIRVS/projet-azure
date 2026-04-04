<template>
  <div id="app">
    <div class="container">
      <header>
        <h1>Azure Project</h1>
        <p class="subtitle">Vue.js + Node Express + Cosmos DB</p>
      </header>

      <main class="card">
        <div class="input-group">
          <label>Ajouter un nouveau prénom</label>
          <div class="flex-row">
            <input 
              v-model="nouveauPrenom" 
              type="text" 
              placeholder="Ex: Lucas" 
              @keyup.enter="ajouterUtilisateur"
            />
            <button @click="ajouterUtilisateur" :disabled="chargement">
              {{ chargement ? '...' : 'Ajouter' }}
            </button>
          </div>
        </div>

        <div v-if="message.texte" :class="['alert', message.type]">
          {{ message.texte }}
        </div>

        <section class="list-section">
          <div class="list-header">
            <h3>Utilisateurs en base</h3>
            <button class="btn-refresh" @click="chargerDonnees">🔄</button>
          </div>
          
          <ul v-if="utilisateurs.length > 0">
            <li v-for="user in utilisateurs" :key="user.id">
              <span class="dot"></span> {{ user.prenom }}
            </li>
          </ul>
          <p v-else class="empty-list">Aucun utilisateur trouvé.</p>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const API_URL = "https://api-azure-eugpbmgdaufageaj.westus2-01.azurewebsites.net/api";

const nouveauPrenom = ref('');
const utilisateurs = ref([]);
const chargement = ref(false);
const message = ref({ texte: '', type: '' });


const chargerDonnees = async () => {
  try {
    const res = await fetch(`${API_URL}/getUsers`);
    if (!res.ok) throw new Error("Erreur serveur");
    utilisateurs.value = await res.json();
  } catch (err) {
    console.error(err);
    message.value = { texte: "Impossible de charger les données.", type: "error" };
  }
};

const ajouterUtilisateur = async () => {
  if (!nouveauPrenom.value.trim()) return;

  chargement.value = true;
  message.value = { texte: '', type: '' };

  try {
    const res = await fetch(`${API_URL}addUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: nouveauPrenom.value })
    });

    if (res.ok) {
      message.value = { texte: "Ajouté avec succès !", type: "success" };
      nouveauPrenom.value = '';
      await chargerDonnees(); 
    } else {
      throw new Error("Échec de l'insertion");
    }
  } catch (err) {
    message.value = { texte: "Erreur de connexion au serveur.", type: "error" };
  } finally {
    chargement.value = false;

    setTimeout(() => { if(message.value.type === 'success') message.value.texte = '' }, 3000);
  }
};


onMounted(chargerDonnees);
</script>

<style scoped>
.container { max-width: 450px; margin: 50px auto; font-family: sans-serif; color: #333; }
header { text-align: center; margin-bottom: 30px; }
h1 { color: #0078d4; margin: 0; }
.subtitle { color: #666; font-size: 0.9rem; }

.card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eee; }

.input-group label { display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px; color: #555; }
.flex-row { display: flex; gap: 10px; }

input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; outline: none; }
input:focus { border-color: #0078d4; }

button { background: #0078d4; color: white; border: none; padding: 0 15px; border-radius: 6px; cursor: pointer; font-weight: bold; }
button:hover { background: #005a9e; }
button:disabled { background: #ccc; }

.alert { margin-top: 15px; padding: 10px; border-radius: 6px; font-size: 0.85rem; text-align: center; }
.success { background: #e6fffa; color: #2d6a4f; border: 1px solid #b7e4c7; }
.error { background: #fff1f0; color: #a8071a; border: 1px solid #ffa39e; }

.list-section { margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px; }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.list-header h3 { font-size: 1rem; margin: 0; }
.btn-refresh { background: none; border: none; cursor: pointer; font-size: 1.1rem; }

ul { list-style: none; padding: 0; }
li { padding: 10px; border-bottom: 1px solid #fafafa; display: flex; align-items: center; font-size: 0.95rem; }
.dot { height: 8px; width: 8px; background: #0078d4; border-radius: 50%; margin-right: 12px; }
.empty-list { text-align: center; color: #999; font-style: italic; font-size: 0.85rem; }
</style>