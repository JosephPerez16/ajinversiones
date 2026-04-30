const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const header = document.getElementById("header");
const links = document.querySelectorAll(".menu a");
const year = document.getElementById("year");
const loanForm = document.getElementById("loanForm");
const amountInput = document.getElementById("amount");
const rateInput = document.getElementById("rate");
const termInput = document.getElementById("term");
const interestResult = document.getElementById("interestResult");
const totalResult = document.getElementById("totalResult");
const feeResult = document.getElementById("feeResult");

const whatsappNumber = "18296677778";

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

const formatMoney = value => {
  return new Intl.NumberFormat("es-DO",{
    style:"currency",
    currency:"DOP",
    minimumFractionDigits:2
  }).format(value || 0);
};

const calculateLoan = () => {
  const amount = Number(amountInput?.value) || 0;
  const rate = Number(rateInput?.value) || 0;
  const term = Number(termInput?.value) || 1;
  const interest = amount * (rate / 100);
  const total = amount + interest;
  const fee = total / term;

  if(interestResult){
    interestResult.textContent = formatMoney(interest);
  }

  if(totalResult){
    totalResult.textContent = formatMoney(total);
  }

  if(feeResult){
    feeResult.textContent = formatMoney(fee);
  }

  return {amount, rate, term, interest, total, fee};
};

[amountInput,rateInput,termInput].forEach(input=>{
  if(input){
    input.addEventListener("input",calculateLoan);
    input.addEventListener("change",calculateLoan);
  }
});

if(loanForm){
  loanForm.addEventListener("submit",event=>{
    event.preventDefault();

    if(!loanForm.checkValidity()){
      loanForm.reportValidity();
      return;
    }

    const submitButton = loanForm.querySelector("button[type='submit']");
    const originalText = submitButton ? submitButton.textContent : "";

    if(submitButton){
      submitButton.textContent = "Preparando solicitud...";
      submitButton.disabled = true;
    }

    const data = calculateLoan();
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const income = Number(document.getElementById("income").value) || 0;
    const workplace = document.getElementById("workplace").value.trim();
    const jobTime = document.getElementById("jobTime").value;
    const employmentType = document.getElementById("employmentType").value;
    const loanType = document.getElementById("loanType").value;
    const paymentDay = document.getElementById("paymentDay").value;
    const purpose = document.getElementById("purpose").value;
    const details = document.getElementById("details").value.trim() || "No especificado";

    const message = `Hola AJ Inversiones, deseo solicitar una evaluación de préstamo.\n\n📋 *SOLICITUD AJ INVERSIONES*\n\n👤 *Datos del solicitante*\n• Nombre y apellido: ${fullName}\n• Teléfono: ${phone}\n• Ciudad o sector: ${city}\n\n💼 *Datos laborales*\n• Ingreso mensual: ${formatMoney(income)}\n• Lugar de trabajo: ${workplace}\n• Tiempo laborando: ${jobTime}\n• Tipo de ingreso: ${employmentType}\n\n🏦 *Datos del préstamo*\n• Tipo de préstamo: ${loanType}\n• Monto solicitado: ${formatMoney(data.amount)}\n• Tasa seleccionada: ${data.rate}%\n• Plazo deseado: ${data.term} mes(es)\n• Forma de pago preferida: ${paymentDay}\n• Motivo: ${purpose}\n• Detalles adicionales: ${details}\n\n📊 *Estimado calculado*\n• Interés estimado: ${formatMoney(data.interest)}\n• Total estimado: ${formatMoney(data.total)}\n• Cuota aproximada: ${formatMoney(data.fee)}\n\nEntiendo que esta solicitud no representa aprobación automática y quedo atento a la evaluación.`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url,"_blank");

    setTimeout(()=>{
      if(submitButton){
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    },900);
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
