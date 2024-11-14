import { ProductAdditional } from "./ProductAdditional.model";

export interface AdditionalResponse {
    asignados: ProductAdditional[];
    noAsignados: ProductAdditional[];
}