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
        return item === itemToRemove;
    });
}

// Returns a function that when run, removes the item from the list.
export function createRemoveItemCallback(listToRemoveFrom, itemToRemove) {
    return () => {
        removeItemFromList(listToRemoveFrom, itemToRemove);
    };
}

export function shuffleList(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
