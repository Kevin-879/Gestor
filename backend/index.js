import { A_Insertar } from "./insertar.js";
import { A_Consultar } from "./consultar.js";
import { A_Eliminar } from "./eliminar.js";
import { A_Actualizar } from "./actualizar.js";

const mongoLink = 'mongodb+srv://ambidata2024:ambidata2024**@ambidata.vn0dlbx.mongodb.net/';
const baseDat = "ambidata";
const colection = "A_microSer";

const ser_Insertar = new A_Insertar(3001, mongoLink, baseDat, colection);
const ser_Consultar = new A_Consultar(3002, mongoLink, baseDat, colection);
const ser_Eliminar = new A_Eliminar(3003, mongoLink, baseDat, colection);
const ser_Actualizar = new A_Actualizar(3004, mongoLink, baseDat, colection);

ser_Insertar.iniciar();
ser_Consultar.iniciar();
ser_Eliminar.iniciar();
ser_Actualizar.iniciar();