import express from "express";
import bodyParser from 'body-parser';
import { MongoClient } from "mongodb";
import cors from "cors";

export class A_Actualizar {
    constructor(puerto, mongoLink, baseDat, colection) {
        this.puerto = puerto;
        this.mongoLink = mongoLink;
        this.baseDat = baseDat;
        this.colection = colection;

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.put('/api/actualizar', this.a_actualizar.bind(this));
    }

    async a_actualizar(req, res) {
        try {
            const conecxion = await MongoClient.connect(this.mongoLink);
            const baseDatos = conecxion.db(this.baseDat);
            const coleccion = baseDatos.collection(this.colection);

            const respuesta = await coleccion.updateOne(
                { Documento: req.body.Documento },
                { $set: req.body }
            );

            if (respuesta.modifiedCount > 0) {
                const data = await coleccion.findOne({ Documento: req.body.Documento });
                res.json(data); // Enviar el documento actualizado
            } else {
                res.status(404).send('Documento no encontrado');
            }

            conecxion.close();
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }

    iniciar() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor de actualización escuchando en el puerto ${this.puerto}`);
        });
    }
}