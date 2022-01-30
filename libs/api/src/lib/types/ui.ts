export const DOTWOD_CATEGORIES = {
    SCHEDULES: 'Schedules',
    FORMATS: 'Formats',
    EXERCISES: 'Exercises',
    EQUIPMENT: 'Equipment'
} as const;

export type DOTWOD_CATEGORIES = typeof DOTWOD_CATEGORIES[keyof typeof DOTWOD_CATEGORIES];

export const DOTWOD_TIMEDIRECTION = {
    STOPWATCH: 'Stopwatch',
    TIMER: 'Timer'
} as const

export type DOTWOD_TIMEDIRECTION = typeof DOTWOD_TIMEDIRECTION[keyof typeof DOTWOD_TIMEDIRECTION];

export const DOTWOD_ALERT = {
    WORK: 'Work',
    REST: 'Rest'
}

export type DOTWOD_ALERT = typeof DOTWOD_ALERT[keyof typeof DOTWOD_ALERT];

export const DOTWOD_EXERCISETYPES = {
    E: 'Empty',
    M: 'Cardio',
    G: 'Gymnastics',
    W: 'Weightlifting'
} as const;

export type DOTWOD_EXERCISETYPES = typeof DOTWOD_EXERCISETYPES[keyof typeof DOTWOD_EXERCISETYPES];

export const DB_TABLES = {
    SCHEDULES: 'schedule',
    FORMATS: 'format',
    EXERCISES: 'exercise',
    EQUIPMENT: 'equipment',
    EQUIP4EXR: 'exercise_equipment_map'
} as const;

export type DB_TABLES = typeof DB_TABLES[keyof typeof DB_TABLES];

export const DOTWOD_MUSCLEGROUPS = {
    TRAPS: 'Trapezius',
    DELTS: 'Deltoids',
    PECS: 'Pectoralis',
    LATS: 'Latissimus dorsi',
    OBL: 'Oblique',
    ABS: 'Abdominal',
    BIPS: 'Biceps',
    TRIPS: 'Triceps',
    ARMS: 'Forearms',
    PSOAS: 'Psoas',
    GLUTS: 'Glutes',
    HAMS: 'Hamstrings',
    QUADS: 'Quadriceps',
    CALVS: 'Calves'
}

export type DOTWOD_MUSCLEGROUPS = typeof DOTWOD_MUSCLEGROUPS[keyof typeof DOTWOD_MUSCLEGROUPS];