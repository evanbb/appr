export * from './presentation';
export { TodoCommandRepositoryImpl } from './persistence/CommandRepository';
export { TodoQueryRepositoryImpl } from './persistence/QueryRepository';
export { default as Kafka } from './Kafka';
export * from './contract'

export default function infrastructure(application: any) {
  return {};
}
