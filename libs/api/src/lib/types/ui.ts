export const DOTWOD_STATUS = {
    READY: 'Ready',
    RUNNING: 'Running',
    PAUSED: 'Paused',
    FINISHED: 'Finished',
    CANCELLED: 'Cancelled',
    LOGGING: 'Logging',
    LOGGED: 'Logged',
    FINISHEDALL: 'Finished All'
} as const;

export type DOTWOD_STATUS = typeof DOTWOD_STATUS[keyof typeof DOTWOD_STATUS];

export const DOTWOD_CATEGORIES = {
    SCHEDULES: 'Schedules',
    FORMATS: 'Formats',
    EXERCISES: 'Exercises',
    EQUIPMENT: 'Equipment'
} as const;

export type DOTWOD_CATEGORIES = typeof DOTWOD_CATEGORIES[keyof typeof DOTWOD_CATEGORIES];

export const DOTWOD_HISTORY = {
    WEEK: 'Week',
    MONTH: 'Month',
    IMPORT: 'Import'
}

export type DOTWOD_HISTORY = typeof DOTWOD_HISTORY[keyof typeof DOTWOD_HISTORY];

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

export const DOTWOD_EXERCISEGAUGE = {
    REPS: 'Repetitions',
    METERS: 'Meters',
    SECONDS: 'Seconds'
} as const;

export type DOTWOD_EXERCISEGAUGE = typeof DOTWOD_EXERCISEGAUGE[keyof typeof DOTWOD_EXERCISEGAUGE];

export const DOTWOD_EXERCISEROLE = {
    COUNT: 'Count',
    BUYIN: 'Buy in',
    BUYOUT: 'Buy out',
    COOP: 'Co-op',
    INTERVAL: 'Interval',
    PENALTY: 'Penalty'
} as const;

export type DOTWOD_EXERCISEROLE = typeof DOTWOD_EXERCISEROLE[keyof typeof DOTWOD_EXERCISEROLE];

export const DB_TABLES = {
    SCHEDULES: 'available_schedule',
    FORMATS: 'available_format',
    EXERCISES: 'available_exercise',
    EQUIPMENT: 'available_equipment',
    EQUIP4EXR: 'available_exercise_equipment_map',
    WODS: 'wod',
    WOD_RESULTS: 'wod_result',
    WOD_EXERCISES: 'wod_exercise'
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
} as const;

export type DOTWOD_MUSCLEGROUPS = typeof DOTWOD_MUSCLEGROUPS[keyof typeof DOTWOD_MUSCLEGROUPS];

export const DOTWOD_LOGBY = {
    GAUGE: 'Gauge',
    ROUNDS: 'Rounds',
    YESNO: 'Yes/No'
} as const;

export type DOTWOD_LOGBY = typeof DOTWOD_LOGBY[keyof typeof DOTWOD_LOGBY];