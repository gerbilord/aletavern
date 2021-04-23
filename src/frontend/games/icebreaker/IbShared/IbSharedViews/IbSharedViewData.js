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

    getMainView() {
        return this.viewTypeHierarchy[0];
    }

    setExtraData(newData) {
        this.extraViewData = newData;
    }

    getExtraData() {
        return this.extraViewData;
    }
}
