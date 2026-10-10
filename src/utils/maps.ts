import fs from 'fs';
import type { CellType } from './game';

export type MapData = {
    problem: {
        spots: {
            brand: number;
            pos: number;
            stocks: number;
        }[];
        agentStarts: number[];
        fuelLimits: number;
        daySteps: number[];
        daySeconds: number[];
        busyThreshold: number;
        jammedThreshold: number;
        width: number;
        height: number;
        cells: CellType[][];
    };
    teams: { token: string }[];
};

export function getMaps(): { id: string; name: string }[] {
    const files = fs.readFileSync('./maps.json', 'utf-8');
    return JSON.parse(files);
}

export function getMapData(id: string): MapData {
    const filePath = `./maps/${id}.json`;

    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}
