const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const header = document.getElementById("header");
const links = document.querySelectorAll(".menu a");
const year = document.getElementById("year");
const loanForm = document.getElementById("loanForm");
const amountInput = document.getElementById("amount");
const termInput = document.getElementById("term");
const paymentFrequencyInput = document.getElementById("paymentFrequency");
const interestResult = document.getElementById("interestResult");
const totalResult = document.getElementById("totalResult");
const feeResult = document.getElementById("feeResult");
const steps = document.querySelectorAll(".form-step");
const nextStep = document.getElementById("nextStep");
const prevStep = document.getElementById("prevStep");
const submitLoan = document.getElementById("submitLoan");
const progressBar = document.getElementById("progressBar");
const stepNumber = document.getElementById("stepNumber");
const stepText = document.getElementById("stepText");
const finalSummary = document.getElementById("finalSummary");
const openOwnerLogin = document.getElementById("openOwnerLogin");
const closeOwnerLogin = document.getElementById("closeOwnerLogin");
const ownerModal = document.getElementById("ownerModal");
const ownerLoginForm = document.getElementById("ownerLoginForm");
const loginError = document.getElementById("loginError");
const ownerPanel = document.getElementById("ownerPanel");
const isOwnerPage = document.body?.dataset?.page === "owner";
const logoutOwner = document.getElementById("logoutOwner");
const clientsTable = document.getElementById("clientsTable");
const ownerSearch = document.getElementById("ownerSearch");
const exportData = document.getElementById("exportData");
const metricClients = document.getElementById("metricClients");
const metricApproved = document.getElementById("metricApproved");
const metricActive = document.getElementById("metricActive");
const metricLate = document.getElementById("metricLate");

const whatsappNumber = "18296677778";
const fixedRate = 40;
const ownerCredentials = { user: "YohanO", password: "AJ2026" };
const clientsKey = "aj_inversiones_clientes";
const sessionKey = "aj_owner_session";
let currentStep = 0;

if(year){
  year.textContent = new Date().getFullYear();
}

if(hamburger && menu){
  hamburger.addEventListener("click",()=>{
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });
}

links.forEach(link=>{
  link.addEventListener("click",()=>{
    if(hamburger && menu){
      hamburger.classList.remove("active");
      menu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
});

window.addEventListener("scroll",()=>{
  if(header){
    header.classList.toggle("scrolled",window.scrollY > 10);
  }
});

const formatMoney = value => new Intl.NumberFormat("es-DO",{
  style:"currency",
  currency:"DOP",
  minimumFractionDigits:2
}).format(value || 0);

const getClients = () => JSON.parse(localStorage.getItem(clientsKey) || "[]");
const setClients = clients => localStorage.setItem(clientsKey,JSON.stringify(clients));

const getInstallments = () => {
  const months = Number(termInput?.value) || 1;
  const frequency = paymentFrequencyInput?.value || "Mensual";
  if(frequency === "Diario") return Math.max(months * 30,1);
  if(frequency === "Semanal") return Math.max(months * 4,1);
  if(frequency === "Quincenal") return Math.max(months * 2,1);
  return Math.max(months,1);
};

const calculateLoan = () => {
  const amount = Number(amountInput?.value) || 0;
  const term = Number(termInput?.value) || 1;
  const interest = amount * (fixedRate / 100);
  const total = amount + interest;
  const installments = getInstallments();
  const fee = total / installments;
  const frequency = paymentFrequencyInput?.value || "Mensual";

  if(interestResult) interestResult.textContent = formatMoney(interest);
  if(totalResult) totalResult.textContent = formatMoney(total);
  if(feeResult) feeResult.textContent = `${formatMoney(fee)} ${frequency.toLowerCase()}`;

  return {amount, rate: fixedRate, term, interest, total, installments, fee, frequency};
};

const updateFinalSummary = () => {
  if(!finalSummary) return;
  const data = calculateLoan();
  const fullName = document.getElementById("fullName")?.value.trim() || "No especificado";
  const phone = document.getElementById("phone")?.value.trim() || "No especificado";
  const loanType = document.getElementById("loanType")?.value || "No especificado";
  const paymentDay = document.getElementById("paymentDay")?.value.trim() || "No especificado";
  finalSummary.innerHTML = `
    <div><span>Solicitante</span><strong>${fullName}</strong></div>
    <div><span>Teléfono</span><strong>${phone}</strong></div>
    <div><span>Tipo de préstamo</span><strong>${loanType}</strong></div>
    <div><span>Monto solicitado</span><strong>${formatMoney(data.amount)}</strong></div>
    <div><span>Total a pagar</span><strong>${formatMoney(data.total)}</strong></div>
    <div><span>Forma de pago</span><strong>${data.frequency}</strong></div>
    <div><span>Referencia de pago</span><strong>${paymentDay}</strong></div>
  `;
};

const updateSteps = () => {
  steps.forEach((step,index)=>step.classList.toggle("active",index === currentStep));
  if(prevStep) prevStep.style.display = currentStep === 0 ? "none" : "inline-flex";
  if(nextStep) nextStep.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
  if(submitLoan) submitLoan.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";
  if(progressBar) progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  if(stepNumber) stepNumber.textContent = `Paso ${currentStep + 1} de ${steps.length}`;
  if(stepText) stepText.textContent = steps[currentStep]?.dataset.title || "Solicitud";
  if(currentStep === steps.length - 1) updateFinalSummary();
};

const validateCurrentStep = () => {
  const fields = steps[currentStep].querySelectorAll("input, select, textarea");
  for(const field of fields){
    if(!field.checkValidity()){
      field.reportValidity();
      return false;
    }
  }
  return true;
};

[nextStep,prevStep].forEach(button=>{
  if(!button) return;
  button.addEventListener("click",()=>{
    if(button === nextStep){
      if(!validateCurrentStep()) return;
      currentStep = Math.min(currentStep + 1,steps.length - 1);
    }else{
      currentStep = Math.max(currentStep - 1,0);
    }
    updateSteps();
  });
});

[amountInput,termInput,paymentFrequencyInput].forEach(input=>{
  if(input){
    input.addEventListener("input",calculateLoan);
    input.addEventListener("change",calculateLoan);
  }
});

const buildClient = () => {
  const data = calculateLoan();
  return {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    city: document.getElementById("city").value.trim(),
    income: Number(document.getElementById("income").value) || 0,
    workplace: document.getElementById("workplace").value.trim(),
    jobTime: document.getElementById("jobTime").value,
    employmentType: document.getElementById("employmentType").value,
    loanType: document.getElementById("loanType").value,
    amount: data.amount,
    rate: data.rate,
    term: data.term,
    interest: data.interest,
    total: data.total,
    installments: data.installments,
    fee: data.fee,
    paymentFrequency: data.frequency,
    paymentDay: document.getElementById("paymentDay").value.trim(),
    purpose: document.getElementById("purpose").value,
    details: document.getElementById("details").value.trim() || "No especificado",
    status: "Pendiente",
    lateDays: 0,
    lastPayment: "Sin registrar"
  };
};

const buildMessage = client => `Hola AJ Inversiones, deseo solicitar una evaluación de préstamo.\n\n*SOLICITUD AJ INVERSIONES*\n\n*Datos del solicitante*\nNombre y apellido: ${client.fullName}\nTeléfono: ${client.phone}\nCiudad o sector: ${client.city}\n\n*Datos laborales*\nIngreso mensual: ${formatMoney(client.income)}\nLugar de trabajo: ${client.workplace}\nTiempo laborando: ${client.jobTime}\nTipo de ingreso: ${client.employmentType}\n\n*Datos del préstamo*\nTipo de préstamo: ${client.loanType}\nMonto solicitado: ${formatMoney(client.amount)}\nTasa fija: ${client.rate}%\nPlazo deseado: ${client.term} mes(es)\nForma de pago: ${client.paymentFrequency}\nReferencia de pago: ${client.paymentDay}\nMotivo: ${client.purpose}\nDetalles adicionales: ${client.details}\n\n*Estimado calculado*\nInterés: ${formatMoney(client.interest)}\nTotal a pagar: ${formatMoney(client.total)}\nCuota aproximada: ${formatMoney(client.fee)} ${client.paymentFrequency.toLowerCase()}\n\nEntiendo que esta solicitud queda sujeta a evaluación por AJ Inversiones.`;

if(loanForm){
  loanForm.addEventListener("submit",event=>{
    event.preventDefault();
    if(!loanForm.checkValidity()){
      loanForm.reportValidity();
      return;
    }

    const client = buildClient();
    const clients = getClients();
    clients.unshift(client);
    setClients(clients);
    renderClients();

    const originalText = submitLoan ? submitLoan.textContent : "";
    if(submitLoan){
      submitLoan.textContent = "Preparando solicitud...";
      submitLoan.disabled = true;
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildMessage(client))}`,"_blank");

    setTimeout(()=>{
      if(submitLoan){
        submitLoan.textContent = originalText;
        submitLoan.disabled = false;
      }
      loanForm.reset();
      currentStep = 0;
      calculateLoan();
      updateSteps();
    },700);
  });
}

const openModal = () => {
  if(ownerModal){
    if(hamburger && menu){
      hamburger.classList.remove("active");
      menu.classList.remove("active");
    }
    document.body.classList.add("no-scroll","owner-modal-open");
    ownerModal.classList.add("active");
    ownerModal.setAttribute("aria-hidden","false");
    setTimeout(()=>{
      const input = document.getElementById("ownerUser");
      if(input) input.focus();
    },120);
  }
};

const closeModal = () => {
  if(ownerModal){
    if(document.activeElement) document.activeElement.blur();
    ownerModal.classList.remove("active");
    ownerModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("no-scroll","owner-modal-open");
  }
};

if(openOwnerLogin){
  openOwnerLogin.addEventListener("click",()=>{
    if(hamburger && menu){
      hamburger.classList.remove("active");
      menu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
    openModal();
  });
}

if(closeOwnerLogin) closeOwnerLogin.addEventListener("click",closeModal);
if(ownerModal) ownerModal.addEventListener("click",event=>{ if(event.target === ownerModal) closeModal(); });

if(ownerLoginForm){
  ownerLoginForm.addEventListener("submit",event=>{
    event.preventDefault();
    const user = document.getElementById("ownerUser").value.trim();
    const password = document.getElementById("ownerPassword").value.trim();
    if(user === ownerCredentials.user && password === ownerCredentials.password){
      localStorage.setItem(sessionKey,"active");
      loginError.textContent = "";
      ownerLoginForm.reset();
      closeModal();
      window.location.href = "dueno.html";
    }else{
      loginError.textContent = "Credenciales incorrectas.";
    }
  });
}

const showOwnerPanel = () => {
  if(ownerPanel){
    ownerPanel.classList.add("active");
    ownerPanel.setAttribute("aria-hidden","false");
    renderClients();
    setTimeout(()=>ownerPanel.scrollIntoView({behavior:"smooth",block:"start"}),100);
  }
};

const hideOwnerPanel = () => {
  if(ownerPanel){
    ownerPanel.classList.remove("active");
    ownerPanel.setAttribute("aria-hidden","true");
  }
};

if(logoutOwner){
  logoutOwner.addEventListener("click",()=>{
    localStorage.removeItem(sessionKey);
    if(isOwnerPage){
      window.location.href = "index.html";
    }else{
      hideOwnerPanel();
    }
  });
}

const updateClient = (id,updates) => {
  const clients = getClients().map(client=>client.id === id ? {...client,...updates} : client);
  setClients(clients);
  renderClients();
};

const deleteClient = id => {
  const clients = getClients().filter(client=>client.id !== id);
  setClients(clients);
  renderClients();
};

const markPaid = id => {
  updateClient(id,{lastPayment:new Date().toLocaleDateString("es-DO"),lateDays:0,status:"Activo"});
};

const renderClients = () => {
  if(!clientsTable) return;
  const search = ownerSearch?.value.toLowerCase().trim() || "";
  const clients = getClients().filter(client=>{
    const text = `${client.fullName} ${client.phone} ${client.status} ${client.loanType} ${client.paymentFrequency}`.toLowerCase();
    return text.includes(search);
  });

  const allClients = getClients();
  const approved = allClients.filter(client=>client.status === "Aprobado").length;
  const active = allClients.filter(client=>client.status === "Activo" || client.status === "Aprobado").length;
  const late = allClients.filter(client=>Number(client.lateDays) > 0).length;

  if(metricClients) metricClients.textContent = allClients.length;
  if(metricApproved) metricApproved.textContent = approved;
  if(metricActive) metricActive.textContent = active;
  if(metricLate) metricLate.textContent = late;

  if(!clients.length){
    clientsTable.innerHTML = `<tr><td class="empty-row" colspan="7">No hay solicitudes registradas.</td></tr>`;
    return;
  }

  clientsTable.innerHTML = clients.map(client=>`
    <tr>
      <td data-label="Cliente"><strong>${client.fullName}</strong><small>${client.phone}</small><small>${client.city}</small></td>
      <td data-label="Préstamo"><strong>${formatMoney(client.amount)}</strong><small>Total: ${formatMoney(client.total)}</small><small>${client.loanType}</small></td>
      <td data-label="Pago"><strong>${client.paymentFrequency}</strong><small>${formatMoney(client.fee)}</small><small>${client.paymentDay}</small></td>
      <td data-label="Estado"><select class="status-select" data-id="${client.id}"><option ${client.status === "Pendiente" ? "selected" : ""}>Pendiente</option><option ${client.status === "Aprobado" ? "selected" : ""}>Aprobado</option><option ${client.status === "Activo" ? "selected" : ""}>Activo</option><option ${client.status === "Rechazado" ? "selected" : ""}>Rechazado</option><option ${client.status === "Finalizado" ? "selected" : ""}>Finalizado</option></select></td>
      <td data-label="Atraso"><input class="late-input" type="number" min="0" value="${client.lateDays}" data-id="${client.id}"></td>
      <td data-label="Último pago">${client.lastPayment}<small>${new Date(client.createdAt).toLocaleDateString("es-DO")}</small></td>
      <td data-label="Acciones"><div class="action-group"><button class="table-btn gold" data-action="approve" data-id="${client.id}">Aprobar</button><button class="table-btn" data-action="paid" data-id="${client.id}">Pago</button><button class="table-btn red" data-action="delete" data-id="${client.id}">Eliminar</button></div></td>
    </tr>
  `).join("");
};

if(ownerSearch) ownerSearch.addEventListener("input",renderClients);

if(clientsTable){
  clientsTable.addEventListener("change",event=>{
    if(event.target.classList.contains("status-select")) updateClient(event.target.dataset.id,{status:event.target.value});
    if(event.target.classList.contains("late-input")) updateClient(event.target.dataset.id,{lateDays:Number(event.target.value) || 0});
  });

  clientsTable.addEventListener("click",event=>{
    const button = event.target.closest("button");
    if(!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;
    if(action === "approve") updateClient(id,{status:"Aprobado"});
    if(action === "paid") markPaid(id);
    if(action === "delete") deleteClient(id);
  });
}

if(exportData){
  exportData.addEventListener("click",()=>{
    const clients = getClients();
    const rows = [["Cliente","Teléfono","Ciudad","Tipo","Monto","Interés","Total","Forma de pago","Cuota","Estado","Días en atraso","Último pago"]];
    clients.forEach(client=>rows.push([client.fullName,client.phone,client.city,client.loanType,client.amount,client.interest,client.total,client.paymentFrequency,client.fee,client.status,client.lateDays,client.lastPayment]));
    const csv = rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-aj-inversiones.csv";
    a.click();
    URL.revokeObjectURL(url);
  });
}

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

reveals.forEach(item=>observer.observe(item));

calculateLoan();
if(steps.length) updateSteps();
renderClients();
if(isOwnerPage){
  if(localStorage.getItem(sessionKey) !== "active"){
    window.location.href = "index.html";
  }else{
    showOwnerPanel();
  }
}
