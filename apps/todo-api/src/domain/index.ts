import { Todo } from './Todo';

interface DomainLayer {
  Todo: typeof Todo;
}

type DomainFactory<DomainDependencies> = {} extends DomainDependencies
  ? (dependencies?: DomainDependencies) => DomainLayer
  : (dependencies: DomainDependencies) => DomainLayer;

interface DomainDependencies {}

const domain: DomainFactory<DomainDependencies> = function domain() {
  return {
    Todo,
  };
};

export default domain;
export { Todo };
