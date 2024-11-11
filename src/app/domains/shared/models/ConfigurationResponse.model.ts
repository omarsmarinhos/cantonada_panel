import { ConfigImagen } from "./ConfigImagen.model";
import { Configuracion } from "./Configuracion.model";

export interface ConfigurationResponse {
    configuracion: Configuracion;
    configImagenes: ConfigImagen[];
}