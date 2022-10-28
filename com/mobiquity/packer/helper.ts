interface ItemT {
    index: number;
    cost: number;
    weight: number;
}

function knapsack(maxWeight: number, data: { index: number, weight: number, cost: number }[]): string {
    const number_of_items = data.length;
    const DP = new Array(number_of_items + 1).fill(-1).map(() => new Array(maxWeight + 1));
    //sort array based on cost descending order for same cost weight will be in assending order
    data.sort((a, b) => b.cost - a.cost === 0 ? a.weight - b.weight : b.cost - a.cost);

    for (let i = 0; i <= number_of_items; i++) {
        for (let j = 0; j <= maxWeight; j++) {
            if (i == 0 || j == 0) {
                DP[i][j] = 0;
                continue;
            }
            if (data[i - 1].weight > j) {
                DP[i][j] = DP[i - 1][j];
            }
            else {
                DP[i][j] = data[i - 1].cost + DP[i - 1][Math.floor(j - data[i - 1].weight)] > DP[i - 1][j] ?
                    Number(data[i - 1].cost + DP[i - 1][Math.floor(j - data[i - 1].weight)])
                    : DP[i - 1][j];
            }
        }
    }

    let maximumCost = DP[number_of_items][maxWeight];
    let selectedItem:number[] = [];

    for (let i = number_of_items; i > 0 && maximumCost > 0; i--) {
        if (maximumCost == DP[i - 1][maxWeight])
            continue;
        else {
            selectedItem.push(data[i - 1].index);
            maximumCost = maximumCost - data[i - 1].cost;
            maxWeight = maxWeight - data[i - 1].weight;
        }
    }
    return selectedItem.join(',');
}

function getOptimalItems(maxWeight: number, data: ItemT[]): string {
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

export { knapsack, getOptimalItems }
export type { ItemT }