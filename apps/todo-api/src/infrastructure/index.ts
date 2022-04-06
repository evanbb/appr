export * from './presentation';
export { default as TodoRepositoryImpl } from './TodoRepository';
export * from './Kafka';

export default function infrastructure(application: any) {
  return {};
}
