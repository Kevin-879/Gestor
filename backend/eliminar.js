import express from "express";
import bodyParser from 'body-parser';
import { MongoClient } from "mongodb";
import cors from "cors";

export class A_Eliminar {
    constructor(puerto, mongoLink, baseDat, colection) {
        this.puerto = puerto;
        this.mongoLink = mongoLink;
        this.baseDat = baseDat;
        this.colection = colection;

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.delete('/api/eliminar/:documento', this.a_eliminar.bind(this)); // Usar DELETE en lugar de POST
    }

    async a_eliminar(req, res) {
        try {
            const documento = req.params.documento; // Obtener el documento de la URL
            const conecxion = await MongoClient.connect(this.mongoLink);
            const baseDatos = conecxion.db(this.baseDat);
            const coleccion = baseDatos.collection(this.colection);
            const respuesta = await coleccion.deleteOne({ Documento: documento });

            if (respuesta.deletedCount > 0) {
                res.json({ deletedCount: respuesta.deletedCount }); // Enviar la cantidad de documentos eliminados
            } else {
                res.status(404).send('Documento no encontrado');
            }

            conecxion.close();
        } catch (error) {
            console.error('Error al eliminar', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    iniciar() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor de eliminación escuchando en el puerto ${this.puerto}`);
        });
    }
}