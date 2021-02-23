class Lab {
    /**
     * @param elem {HTMLAnchorElement}
     * @param tabs {HTMLAnchorElement[]}
     */
    constructor(elem, tabs) {
        this.elem = elem;
        this.tabs = tabs;
        this.selectedTab = -1;
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
        this.selectedTab = -1;
    }
}

class PageState {
    /** @param labs {Lab[]} */
    constructor(labs) {
        this.labs = labs;
        this.selectedLab = -1;
        window.addEventListener('hashchange', this.initSelected.bind(this));
    }

    async init() {
        for (let i = 0; i < this.labs.length; i++) {
            const lab = this.labs[i];
            if (lab.elem.pathname === window.location.pathname) {
                this.selectLab(i);
                break;
            }
        }
        await this.initSelected();
    }

    async initSelected() {
        for (let i = 0; i < this.labs.length; i++) {
            const lab = this.labs[i];

            for (let j = 0; j < lab.tabs.length; j++) {
                const tab = lab.tabs[j];
                if (tab.hash === window.location.hash) {
                    lab.selectTab(j);
                    break;
                }
            }
        }

        const display = document.querySelector('.contentDisplay');
        const resp = await fetch(`${location.pathname.split('.html')[0]}/${location.hash.substr(1)}.html`);
        display.innerHTML = await resp.text();
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

window.addEventListener('DOMContentLoaded', async () => {
    const tabs = [...document.querySelectorAll('.navItem').values()];
    const labs = [...document.querySelectorAll('.labsNavItem').values()].map(e => new Lab(e, tabs));

    const state = new PageState(labs);
    await state.init();
});
