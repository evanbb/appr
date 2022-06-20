import { Application } from 'this/application';
import { type CreateTodoRequest } from 'this/infrastructure';
import { ProducesResponseType } from '@appr/http';

const factory = (application: Application) => ({
  createTodo: ProducesResponseType(200)
    .ProducesResponseType(201)
    .ProducesResponseType(202)
    .ProducesResponseType(401)
    .ProducesResponseType(403)
    .Post<CreateTodoRequest>()('/todos')((request, response) => {
    const { title } = request.body;
    application.createTodo({
      type: 'CreateTodo',
      title,
      key: '',
    });
    response.sendStatus(202);
  }),

  getTodos: ProducesResponseType(200)
    .ProducesResponseType(401)
    .ProducesResponseType(403)
    .Get()('/todos')((_, response) => {
    response.send(application.getAllTodos());
  }),
});

export default factory;
