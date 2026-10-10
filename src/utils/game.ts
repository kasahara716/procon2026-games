export const CellType = {
    /** 平地 */
    Plain: 0,
    /** 山地 */
    Mountains: 2,
    /** 池 */
    Pond: 3,
    /** 道路 */
    Road: 1,
} as const;
export type CellType = (typeof CellType)[keyof typeof CellType];

export const CarType = {
    /** 補給車 */
    Supply: 1,
    /** 巡回車 */
    Collect: 2,
} as const;
export type CarType = (typeof CarType)[keyof typeof CarType];
