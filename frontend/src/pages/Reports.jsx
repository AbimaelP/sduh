import LayoutClient from '../layouts/LayoutClient';
import Button from '../components/Button'
export default function Reports() {
  return (
    <LayoutClient>
      <div className='p-6 h-full'>
        <div className='flex items-center justify-between'>
          <div className='text-gray f-size-6 font-bold false'>Relatório Interativo</div>
          <Button className='btn w-auto btn-gray' iconPosition='left' icon='fas fa-map' link='/'>Voltar para o Mapa</Button>
        </div>
        <div className='flex-grow flex flex-col relative h-default mt-4'>
          <div className="flex-grow bg-white rounded-lg shadow absolute inset-0">
              <iframe className="w-full h-full rounded-lg" src="https://lookerstudio.google.com/embed/reporting/4d62883c-868a-49d8-93a9-5fe5f08736c5/page/LzmRF" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </LayoutClient>
  )
}