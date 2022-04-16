export * from './presentation';
export { TodoCommandRepositoryImpl } from './persistence/CommandRepository';
export { TodoQueryRepositoryImpl } from './persistence/QueryRepository';
export * from './Kafka';

export default function infrastructure(application: any) {
  return {};
}
