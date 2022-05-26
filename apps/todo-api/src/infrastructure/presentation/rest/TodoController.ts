// #region junk
import { Application } from 'this/application';
import { type CreateTodoRequest } from 'this/infrastructure';
import { type ControllerFactory } from '@appr/http';

const factory: ControllerFactory = (application: Application) => (builder) =>
  builder
    .Post<CreateTodoRequest>()
    .Route('/todos')
    .Handler((request, response) => {
      const { title } = request.body;
      application.createTodo({
        type: 'CreateTodo',
        title,
        key: '',
      });
      response.sendStatus(202);
    })
    .Get()
    .Route('/todos')
    .Handler((request, response) => {
      response.send(application.getAllTodos());
    });

export default factory;
