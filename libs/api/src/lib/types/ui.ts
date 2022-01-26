export const DOTWOD_CATEGORIES = {
    SCHEDULES: 'Schedules',
    FORMATS: 'Formats',
    EXERCISES: 'Exercises',
    EQUIPMENT: 'Equipment'
} as const;

export type DOTWOD_CATEGORIES = typeof DOTWOD_CATEGORIES[keyof typeof DOTWOD_CATEGORIES];

export const DOTWOD_EXERCISETYPES = {
    M: 'Cardio',
    G: 'Gymnastics',
    W: 'Weightlifting'
} as const;

export type DOTWOD_EXERCISETYPES = typeof DOTWOD_EXERCISETYPES[keyof typeof DOTWOD_EXERCISETYPES];