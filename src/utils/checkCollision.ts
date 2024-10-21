import { Position } from "../types/game";

export const checkCollision = (pos1: Position, size1: number, pos2: Position, size2: number): boolean => {
    const left1 = pos1.x;
    const right1 = pos1.x + size1;
    const top1 = pos1.y;
    const bottom1 = pos1.y + size1;

    const left2 = pos2.x;
    const right2 = pos2.x + size2;
    const top2 = pos2.y;
    const bottom2 = pos2.y + size2;

    return right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2;
};