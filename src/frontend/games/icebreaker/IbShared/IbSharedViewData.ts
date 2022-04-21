export default class icebreakerViewData {
    private readonly viewTypeHierarchy: string[];
    private extraViewData: {};

    constructor() {
        this.viewTypeHierarchy = [];
        this.extraViewData = {};
    }

    addViewType(newType:string): void {
        this.viewTypeHierarchy.push(newType);
    }

    getViewTypes(): string[] {
        return this.viewTypeHierarchy;
    }

    getMainView(): string {
        return this.viewTypeHierarchy[0];
    }

    getSpecificView(): string {
        return this.viewTypeHierarchy[this.viewTypeHierarchy.length - 1]
    }

    setExtraData(newData:{}): void {
        this.extraViewData = newData;
    }

    getExtraData(): {} {
        return this.extraViewData;
    }
}
