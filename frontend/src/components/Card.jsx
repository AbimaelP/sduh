import '../assets/css/report.css'
import { formatBRL } from '../utils/format';
import open from '../utils/open';
import Section from './Section'
import Checkbox from './Checkbox'
import Icon from './Icon'
import Button from './Button'

export default function Card({ item, checked, onChange }) {
  return (
    <Section className="card-container p-4 bg-white rounded-2xl shadow">
      <Section className="card-header flex items-center">
        <label className="flex items-center cursor-pointer w-full">
          <Checkbox
            className="w-5 h-5 mr-2"
            checked={checked}
            onChange={onChange}
          />
          <Section className="font-bold">{item.nomeEmpreendimento}</Section>
        </label>
      </Section>

      <Section className="card-info">
        <Section className="card-item card-item-endereco">
          <Section className="flex">
            <span className="container-icone-card-report">
              <Icon
                icon="fas fa-map-marker-alt text-red"
                className="mr-2 f-size-small icon-card-report-item"
              />
            </span>
            <Section className="card-info-item">
              <span className="item-info-title">
                Endereço do Empreendimento:
              </span>
              <span
                className="item-info-detail"
                title={item.enderecoEmpreendimento}
              >
                {item.enderecoEmpreendimento}
              </span>
            </Section>
          </Section>
        </Section>

        <Section className="card-item">
          <Section className="flex">
            <span className="container-icone-card-report">
              <Icon
                icon="fas fa-city"
                className="mr-2 f-size-small icon-card-report-item"
              />
            </span>
            <Section className="card-info-item">
              <span className="item-info-title">Município:</span>
              <span className="item-info-detail">{item.municipio}</span>
            </Section>
          </Section>
        </Section>

        <Section className="card-item">
          <Section className="flex">
            <span className="container-icone-card-report">
              <Icon
                icon="fas fa-bed"
                className="mr-2 f-size-small icon-card-report-item"
              />
            </span>
            <Section className="card-info-item">
              <span className="item-info-title">Número de Dormitórios:</span>
              <span className="item-info-detail">{item.qtDormitorio}</span>
            </Section>
          </Section>
        </Section>

        <Section className="card-item">
          <Section className="flex">
            <span className="container-icone-card-report">
              <Icon
                icon="fas fa-building"
                className="mr-2 f-size-small icon-card-report-item"
              />
            </span>
            <Section className="card-info-item">
              <span className="item-info-title">Tipologia:</span>
              <span className="item-info-detail">{item.tipologia}</span>
            </Section>
          </Section>
        </Section>

        <Section className="card-item">
          <Section className="flex">
            <span className="container-icone-card-report">
              <Icon
                icon="fas fa-hand-holding-usd"
                className="mr-2 f-size-small icon-card-report-item"
              />
            </span>
            <Section className="card-info-item">
              <span className="item-info-title">Valor do Subsídio:</span>
              <span className="item-info-detail">
                {formatBRL(item.subsidioEstadual)}
              </span>
            </Section>
          </Section>
        </Section>
        <Section className="w-full flex justify-center">
          <Button
            className="btn btn-green font-bold-important"
            iconPosition="left"
            icon="fab fa-whatsapp"
            onClick={() => open(`https://wa.me/55NUMERO?text=MENSAGEM`)}
          >
            Fale pelo Whatsapp
          </Button>
        </Section>
      </Section>
    </Section>
  );
}
