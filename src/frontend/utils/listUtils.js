export function filterInPlace(listToFilter, filterFunction) {
    listToFilter.splice(
        0,
        listToFilter.length,
        ...listToFilter.filter(filterFunction)
    );
}

// Removes every matching (===) item from the list
export function removeItemFromList(listToRemoveItemFrom, itemToRemove) {
    filterInPlace(listToRemoveItemFrom, (item) => {
        return item !== itemToRemove;
    });
}

// Returns a function that when run, removes the item from the list.
export function createRemoveItemCallback(listToRemoveFrom, itemToRemove) {
    return () => {
        removeItemFromList(listToRemoveFrom, itemToRemove);
    };
}

// Randomizes a list in place.
export function shuffleList(array) {
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

export function addObjectToListAndAddCleanUp(objectList, object, cleanUpFunctionList) {
    cleanUpFunctionList.push(
        createRemoveItemCallback(objectList, object)
    );
    objectList.push(object);
}
