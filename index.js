class Lab {
    /**
     * @param elem {Element}
     * @param tabs {Element[]}
     */
    constructor(elem, tabs) {
        this.elem = elem;
        this.tabs = tabs;
        this.selectTab(0);
        tabs.forEach((e, i) => e.addEventListener('click', () => {
            this.selectTab(i);
        }));
    }

    activateElement() {
        this.elem.classList.add('activated');
    }

    deactivateElement() {
        this.elem.classList.remove('activated');
        this.unselectTab();
    }

    /** @param n {number} */
    selectTab(n) {
        this.unselectTab();
        const tab = this.tabs[n];
        if (!tab) {
            return;
        }
        tab.classList.add('activated');
        this.selectedTab = n;
    }

    unselectTab() {
        const selected = this.tabs[this.selectedTab];
        if (!selected) {
            return;
        }
        selected.classList.remove('activated');
    }
}

class PageState {
    /** @param labs {Lab[]} */
    constructor(labs) {
        this.labs = labs;
        this.selectLab(0);
        labs.forEach((l, i) => l.elem.addEventListener('click', () => {
            this.selectLab(i);
        }));
    }

    /** @param n {number} */
    selectLab(n) {
        this.removeSelection();

        const lab = this.labs[n];
        if (!lab) {
            return;
        }
        this.selectedLab = n;
        lab.activateElement();
        lab.selectTab(0);
    }

    removeSelection() {
        const selected = this.labs[this.selectedLab];
        if (!selected) {
            return;
        }
        selected.deactivateElement();
        this.selectedLab = -1;
    }
}

const tabs = [...document.querySelectorAll('.navItem').values()];
const labs = [...document.querySelectorAll('.labsNavItem').values()].map(e => new Lab(e, tabs));

const state = new PageState(labs);
