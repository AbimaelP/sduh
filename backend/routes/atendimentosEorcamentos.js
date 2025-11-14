import express from "express";
import axios from "axios";
import { API_URL, CLIENT_ID, CLIENT_SECRET } from "../config.js";

const router = express.Router();

// GET /orcamentos/lista-orcamento
router.get("/atendimentos", async (req, res) => {
  const { token, statusFilter } = req.query;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    let desempenho = {
      desembolso: { valor: 0, total: 0, porcentagem: 0 },
      execucao: { valor: 0, total: 0, porcentagem: 0 },
      metas: { valor: 0, total: 0, porcentagem: 0 },
      obrasForaMandato: { valor: 0, porcentagem: 0 },
      intercorrencias: { valor: 0, porcentagem: 0 },
    };

    let totalizadores = {
      planejamento: 0,
      licitacao: 0,
      em_andamento: 0,
      entregues: 0,
      alertas: 0,
    };

    let totalizadoresFiltred = { ...totalizadores };

    const responseAtendimentos = await axios.get(`${API_URL}/atendimentos/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let atendimentos = responseAtendimentos.data.atendimentos.map((item) => {
      return {
        uhNucleoBenViabilizados: item.uhNucleoBenViabilizados,
        uhNucleoBenLicitacao: item.uhNucleoBenLicitacao,
        uhNucleoBenProducao: item.uhNucleoBenProducao,
        uhNucleoBenEntregues: item.uhNucleoBenEntregues,
        uhNucleoBenConcluido: item.uhNucleoBenConcluido,
        qtdAlerta: item.qtdAlerta,
        investEntregue: item.investEntregue,
        dataTerminoReprogramada: item.dataTerminoReprogramada,
        subprograma: item.atendimentoHabitacional,
        municipio: item.municipio,
        gerenciaRegional: item.gerenciaRegional,
        regiaoAdministrativa: item.regiaoAdministrativa,
        regiaoDeGoverno: item.regiaoDeGoverno,
        latitude: item.latitude,
        longitude: item.longitude,
        alertasDetalhados: item.alertasDetalhados,
      };
    });

    atendimentos.forEach((item) => {
      desempenho.execucao.valor += parseInt(item.investEntregue);

      const anoAtual = new Date().getFullYear();
      const inicioMandato = new Date(
        Math.floor((anoAtual - 1) / 4) * 4 + 1,
        0,
        1
      ); // ex: 2023-01-01
      const fimMandato = new Date(inicioMandato.getFullYear() + 3, 11, 31); // ex: 2026-12-31

      // ---- Cálculo de obras fora do mandato ----
      if (item.dataTerminoReprogramada) {
        const termino = new Date(item.dataTerminoReprogramada);

        const isDataValida =
          !isNaN(termino) && item.dataTerminoReprogramada !== "1970-01-01";

        if (isDataValida) {
          if (termino < inicioMandato || termino > fimMandato) {
            desempenho.obrasForaMandato.valor++;
          }
        }
      }

      desempenho.metas.valor += parseInt(item.uhNucleoBenEntregues);
      if (
        item.uhNucleoBenEntregues > 0 ||
        item.uhNucleoBenConcluido > 0 ||
        item.uhNucleoBenProducao > 0
      ) {
        desempenho.desembolso.valor += parseInt(item.investEntregue);
      }

      if (item.qtdAlerta > 0) {
        desempenho.intercorrencias.valor += parseInt(item.qtdAlerta);
      }

      totalizadores.planejamento += item.uhNucleoBenViabilizados;
      totalizadores.licitacao += item.uhNucleoBenLicitacao;
      totalizadores.em_andamento += item.uhNucleoBenProducao;
      totalizadores.entregues += item.uhNucleoBenEntregues;
      totalizadores.entregues += item.uhNucleoBenConcluido;
      totalizadores.alertas += item.qtdAlerta;
    });

    const responseOrcamentos = await axios.get(
      `${API_URL}/orcamento/listaorcamento`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    responseOrcamentos.data.data.forEach((item) => {
      (desempenho.execucao.total += parseInt(item.valorTotalOrcamento)),
        (desempenho.metas.total += item.ultimaMeta),
        (desempenho.desembolso.total += parseInt(item.valorTotalOrcamento));
    });
    desempenho.intercorrencias.total =
      responseOrcamentos.data.cache_stats.total_empreendimentos;
    desempenho.desembolso.porcentagem =
      desempenho.desembolso.total > 0
        ? parseFloat(
            (
              (desempenho.desembolso.valor / desempenho.desembolso.total) *
              100
            ).toFixed(2)
          )
        : 0;
    desempenho.execucao.porcentagem =
      desempenho.execucao.total > 0
        ? parseFloat(
            (
              (desempenho.execucao.valor / desempenho.execucao.total) *
              100
            ).toFixed(2)
          )
        : 0;
    desempenho.metas.porcentagem =
      desempenho.metas.total > 0
        ? parseFloat(
            ((desempenho.metas.valor / desempenho.metas.total) * 100).toFixed(2)
          )
        : 0;
    desempenho.intercorrencias.porcentagem =
      desempenho.intercorrencias.total > 0
        ? parseFloat(
            (
              (desempenho.intercorrencias.valor /
                desempenho.intercorrencias.total) *
              100
            ).toFixed(2)
          )
        : 0;

    switch (statusFilter) {
      case "planejamento":
        totalizadoresFiltred.planejamento = totalizadores.planejamento;
        break;
      case "licitacao":
        totalizadoresFiltred.licitacao = totalizadores.licitacao;
        break;
      case "em_andamento":
        totalizadoresFiltred.em_andamento = totalizadores.em_andamento;
        break;
      case "entregues":
        totalizadoresFiltred.entregues = totalizadores.entregues;
        break;
      case "alertas":
        totalizadoresFiltred.alertas = totalizadores.alertas;
        break;
      default:
        totalizadoresFiltred.alertas = totalizadores.alertas;
        break;
    }

    totalizadoresFiltred = totalizadores;
    totalizadoresFiltred.total =
      totalizadoresFiltred.planejamento +
      totalizadoresFiltred.licitacao +
      totalizadoresFiltred.em_andamento +
      totalizadoresFiltred.entregues +
      totalizadoresFiltred.alertas;

    atendimentos = atendimentos.filter((item) => {
      switch (statusFilter) {
        case "planejamento":
          return item.uhNucleoBenViabilizados > 0;
        case "licitacao":
          return item.uhNucleoBenLicitacao > 0;
        case "em_andamento":
          return item.uhNucleoBenProducao > 0;
        case "entregues":
          return item.uhNucleoBenEntregues > 0 || item.uhNucleoBenConcluido > 0;
        case "alertas":
          return item.qtdAlerta; // ajuste conforme seu campo de alerta real
        default:
          return true;
      }
    });

    return res.json({
      desempenho,
      totalizadores: totalizadoresFiltred,
      atendimentos: atendimentos,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error || err.message || "Erro desconhecido";
    return res.status(status).json({ error: message });
  }
});

const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, " ") // transforma vários espaços em 1
    .replace(/[.,]/g, "") // (opcional) remove vírgula/ponto
    .trim();

router.post("/totalizadores-desempenho", async (req, res) => {
  const { token } = req.query;
  const { municipio, gerenciaRegional, regiaoAdministrativa, regiaoDeGoverno, subprograma } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    let desempenho = {
      desembolso: { valor: 0, total: 0, porcentagem: 0 },
      execucao: { valor: 0, total: 0, porcentagem: 0 },
      metas: { valor: 0, total: 0, porcentagem: 0 },
      obrasForaMandato: { valor: 0, porcentagem: 0 },
      intercorrencias: { valor: 0, porcentagem: 0 },
    };

    let totalizadores = {
      planejamento: 0,
      licitacao: 0,
      em_andamento: 0,
      entregues: 0,
      alertas: 0,
    };

    let totalizadoresFiltred = { ...totalizadores };

    const responseAtendimentos = await axios.get(`${API_URL}/atendimentos/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let atendimentos = responseAtendimentos.data.atendimentos.map((item) => {
      return {
        uhNucleoBenViabilizados: item.uhNucleoBenViabilizados,
        uhNucleoBenLicitacao: item.uhNucleoBenLicitacao,
        uhNucleoBenProducao: item.uhNucleoBenProducao,
        uhNucleoBenEntregues: item.uhNucleoBenEntregues,
        uhNucleoBenConcluido: item.uhNucleoBenConcluido,
        qtdAlerta: item.qtdAlerta,
        investEntregue: item.investEntregue,
        dataTerminoReprogramada: item.dataTerminoReprogramada,
        subprograma: item.atendimentoHabitacional,
        municipio: item.municipio,
        gerenciaRegional: item.gerenciaRegional,
        regiaoAdministrativa: item.regiaoAdministrativa,
        regiaoDeGoverno: item.regiaoDeGoverno,
        latitude: item.latitude,
        longitude: item.longitude,
        alertasDetalhados: item.alertasDetalhados,
      };
    });

    if (municipio) {
      const term = normalize(municipio);

      atendimentos = atendimentos.filter((item) => {
        const municipio = normalize(item.municipio || "");

        return municipio.includes(term);
      });
    }

    if (gerenciaRegional) {
      const term = normalize(gerenciaRegional);

      atendimentos = atendimentos.filter((item) => {
        const gerenciaRegional = normalize(item.gerenciaRegional || "");

        return gerenciaRegional.includes(term);
      });
    }

    if (regiaoAdministrativa) {
      const term = normalize(regiaoAdministrativa);

      atendimentos = atendimentos.filter((item) => {
        const regiaoAdministrativa = normalize(item.regiaoAdministrativa || "");

        return regiaoAdministrativa.includes(term);
      });
    }

    if (regiaoDeGoverno) {
      const term = normalize(regiaoDeGoverno);

      atendimentos = atendimentos.filter((item) => {
        const regiaoDeGoverno = normalize(item.regiaoDeGoverno || "");

        return regiaoDeGoverno.includes(term);
      });
    }

    if (subprograma) {
      const term = normalize(subprograma);

      atendimentos = atendimentos.filter((item) => {
        const subprograma = normalize(item.subprograma || "");

        return subprograma.includes(term);
      });
    }
    

    atendimentos.forEach((item) => {
      desempenho.execucao.valor += parseInt(item.investEntregue);

      const anoAtual = new Date().getFullYear();
      const inicioMandato = new Date(
        Math.floor((anoAtual - 1) / 4) * 4 + 1,
        0,
        1
      ); // ex: 2023-01-01
      const fimMandato = new Date(inicioMandato.getFullYear() + 3, 11, 31); // ex: 2026-12-31

      // ---- Cálculo de obras fora do mandato ----
      if (item.dataTerminoReprogramada) {
        const termino = new Date(item.dataTerminoReprogramada);

        const isDataValida =
          !isNaN(termino) && item.dataTerminoReprogramada !== "1970-01-01";

        if (isDataValida) {
          if (termino < inicioMandato || termino > fimMandato) {
            desempenho.obrasForaMandato.valor++;
          }
        }
      }

      desempenho.metas.valor += parseInt(item.uhNucleoBenEntregues);
      if (
        item.uhNucleoBenEntregues > 0 ||
        item.uhNucleoBenConcluido > 0 ||
        item.uhNucleoBenProducao > 0
      ) {
        desempenho.desembolso.valor += parseInt(item.investEntregue);
      }

      if (item.qtdAlerta > 0) {
        desempenho.intercorrencias.valor += parseInt(item.qtdAlerta);
      }

      totalizadores.planejamento += item.uhNucleoBenViabilizados;
      totalizadores.licitacao += item.uhNucleoBenLicitacao;
      totalizadores.em_andamento += item.uhNucleoBenProducao;
      totalizadores.entregues += item.uhNucleoBenEntregues;
      totalizadores.entregues += item.uhNucleoBenConcluido;
      totalizadores.alertas += item.qtdAlerta;
    });

    const responseOrcamentos = await axios.get(
      `${API_URL}/orcamento/listaorcamento`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    responseOrcamentos.data.data.forEach((item) => {
      (desempenho.execucao.total += parseInt(item.valorTotalOrcamento)),
        (desempenho.metas.total += item.ultimaMeta),
        (desempenho.desembolso.total += parseInt(item.valorTotalOrcamento));
    });
    desempenho.intercorrencias.total =
      responseOrcamentos.data.cache_stats.total_empreendimentos;
    desempenho.desembolso.porcentagem =
      desempenho.desembolso.total > 0
        ? parseFloat(
            (
              (desempenho.desembolso.valor / desempenho.desembolso.total) *
              100
            ).toFixed(2)
          )
        : 0;
    desempenho.execucao.porcentagem =
      desempenho.execucao.total > 0
        ? parseFloat(
            (
              (desempenho.execucao.valor / desempenho.execucao.total) *
              100
            ).toFixed(2)
          )
        : 0;
    desempenho.metas.porcentagem =
      desempenho.metas.total > 0
        ? parseFloat(
            ((desempenho.metas.valor / desempenho.metas.total) * 100).toFixed(2)
          )
        : 0;
    desempenho.intercorrencias.porcentagem =
      desempenho.intercorrencias.total > 0
        ? parseFloat(
            (
              (desempenho.intercorrencias.valor /
                desempenho.intercorrencias.total) *
              100
            ).toFixed(2)
          )
        : 0;

    totalizadores.total = totalizadores.planejamento + totalizadores.licitacao + totalizadores.em_andamento + totalizadores.entregues + totalizadores.alertas;

    return res.json({
      desempenho,
      totalizadores: totalizadores,
    });
  } catch (err) {
    console.log(err)
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error || err.message || "Erro desconhecido";
    return res.status(status).json({ error: message });
  }
});

// GET /orcamentos/lista-orcamento
router.get("/lista-orcamento", async (req, res) => {
  const { statusObra, token } = req.query;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const response = await axios.get(`${API_URL}/orcamento/listaorcamento`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let data = response.data.data;

    return res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error || err.message || "Erro desconhecido";
    return res.status(status).json({ error: message });
  }
});

export default router;
