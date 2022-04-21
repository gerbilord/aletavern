export function filterInPlace<Type>(listToFilter: Type[], filterFunction: (item: Type) => boolean): void {
    listToFilter.splice(
        0,
        listToFilter.length,
        ...listToFilter.filter(filterFunction)
    );
}

// Removes every matching (===) item from the list
export function removeItemFromList<Type>(listToRemoveItemFrom: Type[], itemToRemove: Type): void {
    filterInPlace(listToRemoveItemFrom, (item) => {
        return item !== itemToRemove;
    });
}

// Returns a function that when run, removes the item from the list.
export function createRemoveItemCallback<Type>(listToRemoveFrom: Type[], itemToRemove: Type): () => void {
    return () => {
        removeItemFromList(listToRemoveFrom, itemToRemove);
    };
}

// Randomizes a list in place.
export function shuffleList(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

export function addObjectToListAndAddCleanUp<Type>(objectList: Type[], object: Type, cleanUpFunctionList: (() => void)[]): void {
    cleanUpFunctionList.push(
        createRemoveItemCallback(objectList, object)
    );
    objectList.push(object);
}
