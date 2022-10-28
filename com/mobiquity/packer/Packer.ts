import { readFile } from 'fs/promises';
import { APIException } from './ApiException';
import { isFileAccessable } from './fileUtils';
import { knapsack, ItemT } from './helper';

const REG_EXP = /^[0-9]{1,3}:(\([0-9]+,(\d+[.]?\d*),[€][0-9]+\))+$/m;
const MAX_ITEMS = 15;
const MAX_PACKAGE_WEIGHT = 10000;
const MAX_ITEM_COST = 100;
const MAX_ITEM_WEIGHT = 100;
const DECIMAL_CONVERTION_MULTIPLIER = 100;

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

        let selectedItems: string[] = [];
        packageLines.map((packageLine) => {
            //check content of file is currect.
            if (!REG_EXP.test(packageLine)) {
                throw new APIException('Check file content is matching constrains.');
            }

            const [maxWeightString, itemsData] = packageLine.split(':');
            const maxWeight = Number(maxWeightString)*DECIMAL_CONVERTION_MULTIPLIER;

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
            const selectedItem = knapsack(maxWeight,data) || '-';
            selectedItems.push(selectedItem);

        });

        return selectedItems.join('\n');
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
                weight: Number(weight)*100,
                cost: Number(cost)
            };
        });
    }
}
