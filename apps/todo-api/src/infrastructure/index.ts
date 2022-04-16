export * from './presentation';
export { default as TodoRepositoryImpl } from './persistence/TodoRepository';
export * from './Kafka';

export default function infrastructure(application: any) {
  return {};
}
