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
