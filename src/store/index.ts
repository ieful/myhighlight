import { makeObservable, observable, computed } from "mobx";

class Assistant {

    // 坐标信息
    position = {
        top: -3000,
        left: -3000
    }

    // 选中的内容
    selectedText: string | undefined = '';

    // 显示功能条
    get showCommandbar() {
        return this.selectedText !== '' && this.selectedText !== undefined && !this.showFloatPanel;
    }

    // 显示浮动面板
    showFloatPanel = false;

    // 是否有选中内容
    get hasSelection() {
        return this.selectedText !== ''
    }

    constructor() {
        makeObservable(this, {
            position: observable,
            selectedText: observable,
            showCommandbar: computed,
            showFloatPanel: observable,
            hasSelection: computed,
        });
    }
}



const assistant = new Assistant();

export default assistant;