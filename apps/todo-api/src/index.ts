import application, { Application } from 'this/application';
import domain from 'this/domain';
import infrastructure, {
  Presentation,
  TodoRepositoryImpl,
} from 'this/infrastructure';

const repo = new TodoRepositoryImpl();
const todoApp = new Application(repo);
new Presentation(todoApp).start();

function onion(infra: any) {
  return {
    start: function () {},
  };
}

onion(infrastructure(application(domain()))).start();
