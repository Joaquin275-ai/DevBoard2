class KanbanCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["titulo", "responsable", "prioridad"];
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
        let titulo      = this.getAttribute("titulo")      || "Sin título";
        let responsable = this.getAttribute("responsable") || "Sin asignar";
        let prioridad   = this.getAttribute("prioridad")   || "baja";

        let colorPrioridad = "#3fb950";
        let etiqueta       = "Baja";
        if (prioridad === "alta") {
            colorPrioridad = "#f85149";
            etiqueta       = "Alta";
        }
        if (prioridad === "media") {
            colorPrioridad = "#d29922";
            etiqueta       = "Media";
        }

        const iconoPrioridad = `
            <svg width="7" height="7" viewBox="0 0 8 8" fill="${colorPrioridad}">
                <circle cx="4" cy="4" r="4"/>
            </svg>
        `;

        let palabras  = responsable.split(" ");
        let iniciales = palabras[0][0].toUpperCase();
        if (palabras[1]) {
            iniciales += palabras[1][0].toUpperCase();
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .card {
                    background: #ffffff;
                    border-radius: 10px;
                    padding: 14px 16px;
                    margin-bottom: 10px;
                    border: 1px solid #e5e7eb;
                    border-left: 3px solid ${colorPrioridad};
                    cursor: grab;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    font-family: 'Outfit', sans-serif;
                    user-select: none;
                    position: relative;
                }
                .card:active { cursor: grabbing; }
                .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14); }
                .btn-eliminar {
                    position: absolute; top: 8px; right: 8px; width: 22px; height: 22px;
                    border-radius: 6px; border: none; background: transparent; color: #9ca3af;
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: opacity 0.15s, background 0.15s, color 0.15s; padding: 0; flex-shrink: 0;
                }
                .card:hover .btn-eliminar { opacity: 1; }
                .btn-eliminar:hover { background: #fee2e2; color: #dc2626; }
                .btn-eliminar.confirmando {
                    opacity: 1; background: #fca5a5; color: #dc2626; width: auto; padding: 2px 7px;
                    font-size: 10px; font-weight: 700; font-family: 'Outfit', sans-serif; letter-spacing: 0.3px; border-radius: 6px;
                }
                .footer { display: flex; align-items: center; justify-content: space-between; }
                .responsable-grupo { display: flex; align-items: center; gap: 7px; }
                .avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .nombre { font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; }
                .titulo { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.45; margin: 0 0 14px 0; padding-right: 20px; }
                .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; background: ${colorPrioridad}20; color: ${colorPrioridad}; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
            </style>

            <div class="card">
                <button class="btn-eliminar" title="Eliminar tarjeta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>

                <p class="titulo">${titulo}</p>
                <div class="footer">
                    <div class="responsable-grupo">
                        <div class="avatar">${iniciales}</div>
                        <span class="nombre">${responsable}</span>
                    </div>
                    <span class="badge">${iconoPrioridad} ${etiqueta}</span>
                </div>
            </div>
        `;

        const btnEliminar = this.shadowRoot.querySelector(".btn-eliminar");

        btnEliminar.addEventListener("click", (evento) => {
            evento.stopPropagation();

            if (!btnEliminar.classList.contains("confirmando")) {
                btnEliminar.classList.add("confirmando");
                btnEliminar.innerHTML = "¿Seguro?";

                setTimeout(() => {
                    if (btnEliminar.classList.contains("confirmando")) {
                        btnEliminar.classList.remove("confirmando");
                        btnEliminar.innerHTML = `
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        `;
                    }
                }, 2000);

            } else {
                this.remove();

                this.dispatchEvent(new CustomEvent("tarjeta-eliminada", { bubbles: true, composed: true }));
            }
        });
    }
}

customElements.define("kanban-card", KanbanCard);
