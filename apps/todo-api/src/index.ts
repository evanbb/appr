import CommandConsumer from './infrastructure/persistence/CommandConsumer';
import application, { Application } from 'this/application';
import domain from 'this/domain';
import infrastructure, {
  Kafka,
  Presentation,
  TodoCommandRepositoryImpl,
  TodoQueryRepositoryImpl,
} from 'this/infrastructure';

const todoApp = new Application(
  new TodoCommandRepositoryImpl(
    Kafka.producer,
    new CommandConsumer(Kafka.commandConsumer, Kafka.producer)
  ),
  new TodoQueryRepositoryImpl(Kafka.eventConsumer)
);
new Presentation(todoApp).start();

function onion(infra: any) {
  return {
    start: function () {},
  };
}

onion(infrastructure(application(domain()))).start();
