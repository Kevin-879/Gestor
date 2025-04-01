import express from "express";
import bodyParser from 'body-parser';
import { MongoClient } from "mongodb";
import cors from "cors";

export class A_Insertar {
    constructor(puerto, mongoLink, baseDat, colection) {
        this.puerto = puerto;
        this.mongoLink = mongoLink;
        this.baseDat = baseDat;
        this.colection = colection;

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.post('/api/insertar', this.a_insertar.bind(this));
    }

    async a_insertar(req, res) {
        try {
            const conecxion = await MongoClient.connect(this.mongoLink);
            const baseDatos = conecxion.db(this.baseDat);
            const coleccion = baseDatos.collection(this.colection);
            const respuesta = await coleccion.insertOne(req.body);

            res.json({ id: respuesta.insertedId }); // Enviar el ID del documento insertado

            conecxion.close();
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }

    iniciar() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor de inserción escuchando en el puerto ${this.puerto}`);
        });
    }
}