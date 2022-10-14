import { readFile } from 'fs/promises';
import { APIException } from './ApiException';
import { isFileAccessable } from './fileUtils';

const REG_EXP = /^[0-9]{1,3}:(\([0-9]+,(\d+[.]?\d*),[€][0-9]+\))+$/m;
const MAX_ITEMS = 15;
const MAX_PACKAGE_WEIGHT = 100;
const MAX_ITEM_COST = 100;
const MAX_ITEM_WEIGHT = 100;

interface ItemT {
    index: number;
    cost: number;
    weight: number;
}
export class Packer {
    /*
     * @param {string} filePath - Absolute path off file
     * @returns {string} string with line formatted Path
     */
    static async pack(filePath: string): Promise<string> {

        await isFileAccessable(filePath);

        const fileData = await readFile(filePath, { encoding: 'utf-8' });

        //remove whitespaces from file.
        const packageLines = fileData.replace(/ /g, '').split('\n');

        let selectedItems = '';
        packageLines.map((packageLine) => {
            //check content of file is currect.
            if (!REG_EXP.test(packageLine)) {
                throw new APIException('Check file content is matching constrains.');
            }

            const [maxWeightString, itemsData] = packageLine.split(':');
            const maxWeight = Number(maxWeightString);

            if (maxWeight > MAX_PACKAGE_WEIGHT) {
                throw new APIException(`Maximum weight can not be more then ${MAX_PACKAGE_WEIGHT}`)
            }

            const items = itemsData.replace(/[(€]/g, '').split(')').slice(0, -1);

            const rawData = this.getAllItemsOfPackage(items);

            //check if maxItem constraint is match.
            if (rawData.length >= MAX_ITEMS) {
                throw new APIException(`Items per package can not be more then ${MAX_ITEMS}`)
            }

            //remove all items with weight greather then max value
            const data = rawData.filter((data) => data.weight < maxWeight);
            const selectedItem = this.getOptimalItems(maxWeight, data) || '-';
            selectedItems += selectedItem + '\n';

        });

        return selectedItems;
    }

    private static getOptimalItems(maxWeight: number, data: ItemT[]): string {
        //sort array based on cost descending order for same cost weight will be in assending order
        data.sort((a, b) => b.cost - a.cost === 0 ? a.weight - b.weight : b.cost - a.cost);

        let finalItems = '';

        // Looping through all Items
        for (let i = 0; i < data.length; i++) {
            // If adding Item won't exceed maximum weight then add it to final item, else move to next item
            if (data[i].weight <= maxWeight) {
                maxWeight -= data[i].weight;
                finalItems += data[i].index + ',';
            }
        }

        return finalItems.slice(0, -1);

    }

    private static getAllItemsOfPackage(items: string[]): ItemT[] {
        return items.map((item) => {
            const [index, weight, cost] = item.split(',');
            if (Number(cost) > 100) {
                throw new APIException(`maximum cost of item can not be more then ${MAX_ITEM_COST}`)
            }
            if (Number(weight) > 100) {
                throw new APIException(`maximum weight of item can not be more then ${MAX_ITEM_WEIGHT}`)
            }
            return {
                index: Number(index),
                weight: Number(weight),
                cost: Number(cost)
            };
        });
    }
}
