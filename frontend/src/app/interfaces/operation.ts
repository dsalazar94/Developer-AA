export interface Operation {
  id?: number,
  fecha: Date,
  zona: string,
  guacho: string,
  planta: string,
  flor?: string,
  operacion: string,
  observacion: string,
  active: boolean
}
