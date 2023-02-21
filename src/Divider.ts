export class Divider {
    data: { type: string }

    constructor() {
        this.data = {
            type: 'hr'
        }
    }
    static get toolbox() {
        return {
            title: 'Divider',
            icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="14" height="2" rx="1" fill="#000000"/></svg>'
        };
    }

    render() {
        return document.createElement('hr');
    }

    save() {
        return { type: 'hr' }
    }

}