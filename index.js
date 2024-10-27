function calcularMetroQuadrado(largura, altura) {
    return largura * altura;
}
function calcularPapelParede(larguraParede, alturaParede, larguraRolo, alturaRolo) {
    const areaParede = calcularMetroQuadrado(larguraParede, alturaParede);
    const areaRolo = calcularMetroQuadrado(larguraRolo, alturaRolo);
    
    return Math.ceil(areaParede / areaRolo); // Arredonda para cima para garantir que não falte papel
}
function calcularPapelParedeComAttachments(larguraParede, alturaParede, larguraRolo, alturaRolo, attachments) {
    // Calcula a área da parede
    const areaParede = calcularMetroQuadrado(larguraParede, alturaParede);
    
    // Calcula a área do rolo de papel de parede
    const areaRolo = calcularMetroQuadrado(larguraRolo, alturaRolo);
    
    // Inicializa a área total de attachments
    let areaAttachments = 0;
    
    // Itera sobre cada attachment
    attachments.forEach(attachment => {
        const areaAttachment = calcularMetroQuadrado(attachment.largura, attachment.altura);
        
        // Multiplica pela quantidade
        const quantidade = attachment.quantidade || 1; // Caso a quantidade não seja fornecida, assume 1
        areaAttachments += areaAttachment * quantidade;
    });
    
    // Calcula a área final da parede considerando os attachments
    const areaFinal = Math.max(areaParede - areaAttachments, 0.01);
    
    // Retorna a quantidade de rolos necessária, arredondada para cima
    return Math.ceil(areaFinal / areaRolo);
}
function calcularTapete(larguraSala, alturaSala, larguraTapete, alturaTapete) {
    const areaSala = calcularMetroQuadrado(larguraSala, alturaSala);
    const areaTapete = calcularMetroQuadrado(larguraTapete, alturaTapete);
    
    return Math.ceil(areaSala / areaTapete); // Arredonda para garantir cobertura total
}
function calcularPersiana(larguraJanela, alturaJanela, larguraPersiana, alturaPersiana) {
    const areaJanela = calcularMetroQuadrado(larguraJanela, alturaJanela);
    const areaPersiana = calcularMetroQuadrado(larguraPersiana, alturaPersiana);
    
    return Math.ceil(areaJanela / areaPersiana); // Arredonda para cima para cobrir a janela completamente
}

class calculadoraM2{
    constructor(product, m2 = false){
        this.product = product;
        this.m2 = m2;

        this.form = document.createElement("form");
        this.form.classList.add("calc-form");
        this.form.insertAdjacentHTML("beforeend", `<div class="wrap"></div>`)
    }

    setType(){
        const productName = this.product.name.toLowerCase();

        if(productName.indexOf("papel") !== -1){
            this.type = "papel";
        }

        if(productName.indexOf("tapete") !== -1){
            this.type = "tapete";
        }

        if(productName.indexOf("persiana") !== -1){
            this.type = "persiana";
        }

        if(this.m2){
            this.type = "m2";
        }
    }

    updateProductFields(){
        if(this.product.width){
            this.product.width = parseFloat(this.product.width.replace(",", "."));
        }

        if(this.product.height){
            this.product.height = parseFloat(this.product.height.replace(",", "."));
        }

        console.log(this.product)
    }

    setFields(){
        this.setType();
        this.updateProductFields();

        if(!this.type) return false;

        switch(this.type){
            case "papel":
                this.createFields([
                    {
                        id: "width", 
                        type: "text",
                        title: "Largura",
                    },
                    {
                        id: "height", 
                        type: "text",
                        title: "Altura",
                    },
                ], "Insira a medida da sua parede para calcular",
            "m")
            break;
            case "tapete":
                this.createFields([
                    {
                        id: "width", 
                        type: "text",
                        title: "Largura",
                    },
                    {
                        id: "height", 
                        type: "text",
                        title: "Altura",
                    },
                ], "Insira a altura e largura da sua sala para calcular",
                "m")
            break;
            case "persiana":
                this.createFields([
                    {
                        id: "width", 
                        type: "text",
                        title: "Largura",
                    },
                    {
                        id: "height", 
                        type: "text",
                        title: "Altura",
                    },
                ], "Insira o tamanho da sua janela",
                "m")
            break;
            case "m2":
                this.createFields([
                    {
                        id: "m2", 
                        type: "text",
                        title: "Medida",
                    },
                ], "Insira a medida em metro quadrado para calcular a medida",
                "m²")
            break;
        }

        return this.form;

    }

    setAttachments(attachments){
        if(!this.attachment){
            this.attachment = [];
        }

        attachments.forEach(attachment => {
            this.attachment.push(attachment);
        })
    }

    managerAttachments(){
        if(this.attachment){
            const attachmentsByGroup = this.attachment.filter(attachment => attachment.group === this.type);

            if(attachmentsByGroup.length > 0){
                const btnSubmit = this.form.querySelector("button[type='submit']");

                btnSubmit.insertAdjacentHTML("beforebegin", `
                    <div class="area-attachments"></div>
                `)

                const areaAttachments = this.form.querySelector(".area-attachments");

                attachmentsByGroup.forEach(attachment => {
                    const attachmentElement = document.createElement("div");
                    attachmentElement.classList.add("attachment");
                    attachmentElement.setAttribute("data-attachment", attachment.name);
                    attachmentElement.insertAdjacentHTML("beforeend", `
                        <div class="attachment-header">
                            <strong>${attachment.name}</strong>
                            <img src="${attachment.icon}" alt="${attachment.name}">
                        </div>

                        <div class="attaches-list"></div>

                        <button type="button" add-attachment>Adicionar</button>
                    `)

                    const attachesList = attachmentElement.querySelector(".attaches-list");
                    const btnAddMore = attachmentElement.querySelector("button[add-attachment]");
                    
                    btnAddMore.addEventListener("click", () => {
                        const divAttachmentItem = document.createElement("div");
                        divAttachmentItem.classList.add("attachment-item");
                        divAttachmentItem.setAttribute("data-attachment", attachment.name);

                        divAttachmentItem.insertAdjacentHTML("beforeend", `
                            <button type="button" remove-attachment>Remover</button>
                        `)

                        const btnRemove = divAttachmentItem.querySelector("button[remove-attachment]");
                        btnRemove.addEventListener("click", () => {
                            divAttachmentItem.remove();
                        })

                        const fields = attachment.fields;

                        fields.forEach(field => {
                            divAttachmentItem.insertAdjacentHTML("beforeend", `
                                <div class="field" data-suffix="${field.suffix}">
                                    <label for="${field.id}">${field.title}</label>
                                    <input type="${field.type}" name="${field.id}" id="${field.id}" placeholder="Ex: 2.30" required/>    
                                </div>
                            `)

                            const attachmentInput = divAttachmentItem.querySelector(`input[name="${field.id}"]`);
                            attachmentInput.addEventListener("input", (e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                            })
                        })

                        attachesList.append(divAttachmentItem);
                        
                    });

                    areaAttachments.append(attachmentElement);

                })
            }
        }
    }

    createDinamycField(type, id, title, suffix = "m"){
        const field = document.createElement("div");
        field.classList.add("field");
        field.setAttribute('data-suffix', suffix)

        field.insertAdjacentHTML("beforeend", `
            <label for="${id}">${title}</label>
            <input type="${type}" name="${id}" id="${id}" required/>    
        `)

        const target = this.form.querySelector(".wrap");

        target.append(field);
    }

    createFields(fields, message){
        if(message){
            this.form.insertAdjacentHTML("afterbegin", `
                <p>${message}</p>
            `)
        }

        fields.forEach(({type, id, title, suffix}) => {
            this.createDinamycField(type, id, title, suffix);
        })

        const submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.textContent = "Calcular";

        this.form.append(submit);

        this.form.insertAdjacentHTML("beforeend", `
            <div class="result"></div>
        `)

        const inputs = this.form.querySelectorAll("input");

        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            });
        })

        return this.form;
    }

    modalConfig(){
        const modal = document.querySelector(".modal-calculadora");
        const btnHide = document.querySelector(".modal-calculadora .modal-close");
        const btnOpen = document.querySelector("button[data-calculadora]");
        
        if(modal && btnHide){
            btnHide.addEventListener("click", () => {
                modal.classList.remove("open");
            })
        }

        if(btnOpen){
            btnOpen.addEventListener("click", () => {
                modal.classList.add("open");
            })
        }
    }

    getAttachmentsCompleted(){
        //Get only attachments with all fields is filled
        const attachments = this.form.querySelectorAll(".attachment-item");
        const attachmentsCompleted = [];
        const attachmentsInputs = [];

        attachments.forEach(attachment => {
            const fields = attachment.querySelectorAll(".field");
            let fieldsCompleted = 0;

            fields.forEach(field => {
                const input = field.querySelector("input");
                if(input.value){
                    fieldsCompleted++;
                    attachmentsInputs.push({
                        id: input.getAttribute("name"),
                        value: input.value
                    })
                }
            })

            if(fieldsCompleted === fields.length){
                attachmentsCompleted.push({
                    type: attachment.getAttribute("data-attachment"),
                    fields: attachmentsInputs
                });
            }
        })

        return attachmentsCompleted;

    }

    formSubmitAction(){
        const self = this;

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            const fields = this.form.querySelectorAll(" .wrap .field");

            let values = {};

            fields.forEach(field => {
                const input = field.querySelector("input");
                const name = input.getAttribute("name");
                const value = input.value;

                values[name] = value;
            })

            const result = this.form.querySelector(".result");

            switch(self.type){
                case "papel":
                    const hasAttachments = self.getAttachmentsCompleted();
                    if(hasAttachments.length >0){
                        //Calculate with attachments
                        const attachments = hasAttachments.map(attachment => {
                            let largura = 0;
                            let altura = 0;
                            let quantidade = 1; // Quantidade padrão caso não seja especificada
                            
                            // Encontre os campos "width", "height" e "quantity" nos attachments
                            attachment.fields.forEach(field => {
                                if (field.id === 'width') largura = parseFloat(field.value);
                                if (field.id === 'height') altura = parseFloat(field.value);
                                if (field.id === 'quantity') quantidade = parseInt(field.value) || 1; // Garante um valor mínimo de 1
                            });
                            
                            return { largura, altura, quantidade };
                        });

                        // Calcule com os attachments
                        const papelComAttachments = calcularPapelParedeComAttachments(
                            parseFloat(values.width),         // Largura da parede
                            parseFloat(values.height),        // Altura da parede
                            self.product.width,    // Largura do rolo de papel
                            self.product.height,   // Altura do rolo de papel
                            attachments            // Lista de attachments com quantidade
                        );

                         // Exibir o resultado
                        result.textContent = `Você precisa de ${papelComAttachments} rolos de papel de parede com um total de ${(papelComAttachments * self.product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })} reais`;

                        return;
                    }
                    const papel = calcularPapelParede(values.width, values.height, self.product.width, self.product.height);
                    result.textContent = `Você precisa de ${papel} rolos de papel de parede com um total de ${(papel * self.product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })} reais`;

                break;
                case "tapete":
                    const tapete = calcularTapete(values.width, values.height, self.product.width, self.product.height);
                    result.textContent = `Você precisa de ${tapete} tapetes para cobrir a sala com um total de ${(tapete * self.product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })} reais`;
                break;
                case "persiana":
                    const persiana = calcularPersiana(values.width, values.height, self.product.width, self.product.height);
                    result.textContent = `Você precisa de ${persiana} persianas para cobrir a janela com um total de ${(persiana * self.product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' })} reais`;
                break;
            }
        })
    }
    
    init(){
        const fields = this.setFields();
        
        if(fields){
            const modalBody = document.querySelector(".modal-calculadora .modal-body");
            if(modalBody){
                modalBody.append(this.form);
                this.formSubmitAction();
                this.managerAttachments();
            }
        }

    }
}

const calcApp = new calculadoraM2({
    name: "Papel de parede Belga Innove Niazitex 2,00 X 2,50",
    width: "2,00",
    height: "3,00",
    price: 422.00
});

calcApp.setAttachments([
    {
        group: "papel",
        name: "Janelas",
        icon: "https://kalk.pro/images/wallpaper/constructions/windows.jpg",
        fields: [
            {
                id: "width", 
                type: "text",
                title: "Largura",
                suffix: "m"
            },
            {
                id: "height", 
                type: "text",
                title: "Altura",
                suffix: "m"
            },
            {
                id: "quantity", 
                type: "text",
                title: "Quantidade",
                suffix: "peças"
            },
        ]
    },
    {
        group: "papel",
        name: "Portas",
        icon: "https://kalk.pro/images/wallpaper/constructions/doors.jpg",
        fields: [
            {
                id: "width", 
                type: "text",
                title: "Largura",
                suffix: "m"
            },
            {
                id: "height", 
                type: "text",
                title: "Altura",
                suffix: "m"
            },
            {
                id: "quantity", 
                type: "text",
                title: "Quantidade",
                suffix: "peças"
            },
        ]
    },
])

calcApp.init();
calcApp.modalConfig();
