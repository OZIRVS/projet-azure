<template>
  <div class="flex flex-col md:flex-row min-h-screen md:h-screen w-full font-sans md:overflow-hidden">

    <div class="flex flex-col justify-center items-center w-full md:w-[660px] shrink-0 px-6 py-12 md:px-10 bg-blue-200">

      <header class="text-center mb-8 w-full">
        <h1 class="text-3xl md:text-4xl font-extrabold text-blue-500 tracking-tight">Azure Project</h1>
        <p class="text-slate-400 text-xs md:text-sm mt-1 tracking-widest uppercase">Vue.js · Node Express · Cosmos DB</p>
        <p class="text-xs md:text-sm text-slate-400 uppercase tracking-widest mt-3">
          Réalisé par
          <strong class="text-red-400 font-bold">Luka</strong> ·
          <strong class="text-red-400 font-bold">Brahim</strong> ·
          <strong class="text-red-400 font-bold">Deniz</strong>
        </p>
      </header>

      <main class="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-sm p-5 md:p-7">
        <div class="mb-1">
          <label class="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Ajouter un nouveau prénom
          </label>
          <div class="flex gap-2">
            <input
              v-model="nouveauPrenom"
              type="text"
              class="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-blue-400"
              placeholder="Ex: Jeffrey"
            />
            <button @click="ajouterUtilisateur" :disabled="chargement" class="bg-blue-500 text-white font-bold px-4 md:px-5 rounded-lg text-sm">
              {{ chargement ? '...' : 'Ajouter' }}
            </button>
          </div>
        </div>

        <div v-if="message.texte" :class="['mt-4 px-4 py-2.5 rounded-lg text-xs text-center', message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700']">
          {{ message.texte }}
        </div>

        <section class="mt-6 pt-5 border-t border-slate-100">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Utilisateurs en base</h3>
            <button @click="chargerDonnees" class="text-base bg-transparent cursor-pointer">🔄</button>
          </div>
          <ul v-if="utilisateurs.length > 0" class="max-h-40 md:max-h-none overflow-y-auto">
            <li v-for="user in utilisateurs" :key="user.id" class="flex items-center py-2 text-sm text-slate-700">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              {{ user.prenom }}
            </li>
          </ul>
        </section>
      </main>
    </div>

    <div class="flex-1 h-[300px] md:h-full w-full bg-white leading-[0]">
      <img
        src="/img/Arboresence-site.png"
        alt="Illustration Azure"
        class="w-full h-full object-fill block border-none p-0 m-0"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = "https://api-azure-eugpbmgdaufageaj.westus2-01.azurewebsites.net/api/";

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
    const res = await fetch(`${API_URL}/addUser`, {
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
    setTimeout(() => { if (message.value.type === 'success') message.value.texte = '' }, 3000);
  }
};

onMounted(chargerDonnees);
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
}
</style>