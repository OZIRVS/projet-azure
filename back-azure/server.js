require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { CosmosClient } = require("@azure/cosmos");

const app = express();
app.use(cors());
app.use(express.json());


const endpoint = process.env.COSMOS_CONNECTION_STRING;
const client = new CosmosClient(endpoint);
const container = client.database("bdd-azure").container("Users");

// ROUTE 1 : Récupérer les prénoms
app.get('/api/getUsers', async (req, res) => {
    try {
        const { resources } = await container.items.readAll().fetchAll();
        res.json(resources);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ROUTE 2 : Ajouter un prénom
app.post('/api/addUser', async (req, res) => {
    try {
        const { prenom } = req.body;
        if (!prenom) return res.status(400).send("Prénom requis");
        
        const { resource } = await container.items.create({ prenom });
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));