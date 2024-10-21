import { ITEM_SIZE } from './../constants/game';
import { Position } from "../types/game";
import { checkCollision } from "./checkCollision";

export const generateNonOverlappingItems = (itemCount: number): Position[] => {
    const newItems: Position[] = [];
    while (newItems.length < itemCount) {
        const newItem = {
            x: 8 + Math.random() * (256 - 40),
            y: 8 + Math.random() * (256 - 40),
        };

        const isOverlapping = newItems.some(item => {
            return checkCollision(item, ITEM_SIZE, newItem, ITEM_SIZE)
        });

        if (!isOverlapping) {
            newItems.push(newItem);
        }
    }
    return newItems;
};