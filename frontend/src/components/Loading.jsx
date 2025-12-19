import Icon from './Icon';
import Section from './Section';

export default function Loading({screen}) {
  return (
    <Section className={`flex items-center justify-center ${screen === 'adapte' ? '' : 'w-screen h-screen '}`}>
      <Icon className="" icon="fas fa-spinner fa-spin text-4xl text-blue-500" />
    </Section>
  );
}
