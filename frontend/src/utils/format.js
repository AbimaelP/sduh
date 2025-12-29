export const formatDate = (data) => {
  const d = new Date(data);

  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatHour = (data) => {
  const d = new Date(data);

  return d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatBRL = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export const formatCEP = (value) => {
  if (!value) return "";
  
  const cep = value.toString().replace(/\D/g, "");

  return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
};


export const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD")               // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, " ")            // transforma vários espaços em 1
    .replace(/[.,]/g, "")            // (opcional) remove vírgula/ponto
    .trim();

export const formatWhats = (str) => {
  if (!str) return "";

  const digits = str.replace(/\D/g, "");

  return `https://wa.me/${digits}`;
};