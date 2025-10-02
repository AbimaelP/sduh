import { useEffect, useState } from "react";
import { listaOrcamento } from "../services/api/api";
import Section from "./Section";
import PercentBar from "./PercentBar";
import '../assets/css/performance.css'

export default function Performance(params) {
  // const [allListaOrcamento, setAllListaOrcamento] = useState([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       let data = await listaOrcamento("");
  //       setAllListaOrcamento(data);
  //     } catch (err) {
  //       console.error("Erro ao carregar empreendimentos:", err.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <Section>
      <PercentBar percent={40} labelPercentBar='Registro de Intercorrências' className='f-size-performance' classNameBar="bg-red-dark" classNamePercent="text-red-dark"/>
      <Section className='f-size-performance font-bold flex justify-between mt-4'><span>Obras fora do Mandato {`(>${2026})`}</span> <span className="performance-value-2">5741</span></Section>
      <Section className='f-size-performance font-bold mt-4'>
        <Section>Desembolso vs. Execução</Section>
        <Section>
          <PercentBar percent={43.1} positionPercentBar="row" labelPercentBar='Desembolso' className='f-size-performance' classNameLabel="f-size-performance-min mr-2" classNameBar="bg-blue-39" classNamePercent="ml-2 text-blue-39"/>
          <PercentBar percent={33.1} positionPercentBar="row" labelPercentBar='Execução' className='f-size-performance' classNameLabel="f-size-performance-min mr-2" classNameBar="bg-green-23" classNamePercent="ml-2 text-green-23"/>
        </Section>
      </Section>
      <Section className='f-size-performance font-bold mt-4'>
        <Section className='flex justify-between'>
          <Section>Meta Planejada (UH):</Section>
          <Section className="text-black">51800</Section>
        </Section>
        <PercentBar percent={400.0} positionPercentBar="row" labelPercentBar='% Meta Executada' className='f-size-performance flex justify-between' classNameLabel="f-size-performance-min" classNameContentBar="flex-none" classNamePercent="text-green-23"/>
      </Section>
    </Section>
  )
}