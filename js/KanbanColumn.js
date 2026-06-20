class KanbanColumn extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["titulo", "color"];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            this.render();
        }
    }

    render() {
        let titulo = this.getAttribute("titulo") || "Columna";
        let color  = this.getAttribute("color")  || "#8b949e";

        let tarjetas = this.querySelectorAll("kanban-card");
        let total    = tarjetas.length;

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .columna { background: #161b22; border-radius: 12px; border: 1px solid #30363d; overflow: hidden; min-height: 200px; }
                .columna-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: #1c2128; border-bottom: 2px solid ${color}; }
                .columna-titulo { font-size: 13px; font-weight: 700; color: #e6edf3; font-family: 'Outfit', sans-serif; text-transform: uppercase; letter-spacing: 0.8px; }
                .columna-contador { width: 24px; height: 24px; border-radius: 50%; background: ${color}25; color: ${color}; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; }
                .columna-body { padding: 12px 12px 4px 12px; }
            </style>

            <div class="columna">
                <div class="columna-header">
                    <span class="columna-titulo">${titulo}</span>
                    <span class="columna-contador">${total}</span>
                </div>
                <div class="columna-body">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define("kanban-column", KanbanColumn);
