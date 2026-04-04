require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { CosmosClient } = require("@azure/cosmos");

const app = express();
app.use(cors());
app.use(express.json());


const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database("bdd-azure").container("Users");


app.get('/api/getUsers', async (req, res) => {
    try {
        const { resources } = await container.items.readAll().fetchAll();
        res.json(resources);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


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

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});