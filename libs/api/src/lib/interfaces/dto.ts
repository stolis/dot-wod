export interface IEquipment extends IModification {
    id: number;
    user_id: string;
    equipment_name: string;
    weight: number;
    height: number;
  }
  
  export interface IModification {
    inserted_at: Date;
    modified_at: Date;
    is_deleted: boolean;
  }