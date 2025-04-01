import express from "express";
import bodyParser from 'body-parser';
import { MongoClient } from "mongodb";
import cors from "cors";

export class A_Consultar {
    constructor(puerto, mongoLink, baseDat, colection) {
        this.puerto = puerto;
        this.mongoLink = mongoLink;
        this.baseDat = baseDat;
        this.colection = colection;

        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.get('/api/consultar', this.a_ConsultarTodos.bind(this)); // Consultar todos
        this.app.get('/api/consultar/:documento', this.a_ConsultarUno.bind(this)); // Consultar por documento
    }

    async a_ConsultarTodos(req, res) {
        try {
            const conecxion = await MongoClient.connect(this.mongoLink);
            const baseDatos = conecxion.db(this.baseDat);
            const coleccion = baseDatos.collection(this.colection);
            const respuesta = await coleccion.find({}).toArray(); // Obtener todos los documentos

            res.json(respuesta); // Enviar todos los documentos

            conecxion.close();
        } catch (error) {
            console.error('Error al consultar', error);
            res.status(500).send('Error interno del servidor');
        }
    }

    async a_ConsultarUno(req, res) {
        try {
            let documento = req.params.documento.trim();
    
            const conecxion = await MongoClient.connect(this.mongoLink);
            const baseDatos = conecxion.db(this.baseDat);
            const coleccion = baseDatos.collection(this.colection);
    
            let respuesta = await coleccion.findOne({ Documento: documento });
            if (!respuesta && !isNaN(documento)) {
                respuesta = await coleccion.findOne({ Documento: Number(documento) });
            }
    
            if (respuesta) {
                res.json(respuesta); // Enviar el documento encontrado
            } else {
                res.status(404).json({ mensaje: 'Documento no encontrado' });
            }
    
            conecxion.close();
        } catch (error) {
            console.error('Error al consultar:', error);
            res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }
    
    

    iniciar() {
        this.app.listen(this.puerto, () => {
            console.log(`Servidor de consulta escuchando en el puerto ${this.puerto}`);
        });
    }
}