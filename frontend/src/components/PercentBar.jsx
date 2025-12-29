import Section from "./Section";
import '../assets/css/percentbar.css'

export default function PercentBar({
  percent = 0,
  percentBarVisible = true,
  labelPercentBar = "",
  positionPercentBar = "column",
  className = "",
  classNameLabel = "",
  classNameBar = "",
  classNamePercent = "",
  classNameContentBar = "",
}) {
  return (
    <Section className={`${positionPercentBar === 'column' ? 'flex flex-column' : 'flex items-center' } ${className}`}>
      <Section className='flex justify-between font-bold'>
        <Section className={classNameLabel}>{labelPercentBar}</Section>
        {positionPercentBar === 'column' && (
          <Section className={`${classNamePercent} font-bold-hard`}>{Number(percent).toFixed(1)}%</Section>
        )}
      </Section>
      
      <Section className={`content-percent mt-1 ${classNameContentBar}`}>
        <Section style={{ width: `${percent}%` }} className={`${classNameBar} percent-bar`}></Section>
      </Section>
      
      {positionPercentBar === 'row' && (
        <Section className={`${classNamePercent} font-bold-hard mt-1`}>{Number(percent).toFixed(1)}%</Section>
      )}
    </Section>
  )
}
