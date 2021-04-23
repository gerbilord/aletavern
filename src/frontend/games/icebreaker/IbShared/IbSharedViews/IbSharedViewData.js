export default class icebreakerViewData {
    constructor() {
        this.viewTypeHierarchy = [];
        this.extraViewData = {};
    }

    addViewType(newType) {
        this.viewTypeHierarchy.push(newType);
    }

    getViewTypes() {
        return this.viewTypeHierarchy;
    }

    setExtraData(newData) {
        this.extraViewData = newData;
    }

    getExtraData() {
        return this.extraViewData;
    }
}
