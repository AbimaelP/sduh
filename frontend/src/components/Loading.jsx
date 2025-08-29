import Icon from './Icon';
import Section from './Section';

export default function Loading() {
  return (
    <Section className="flex w-screen h-screen items-center justify-center">
      <Icon className="" icon="fas fa-spinner fa-spin text-4xl text-blue-500" />
    </Section>
  );
}
