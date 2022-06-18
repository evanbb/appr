// #region junk
import { Application } from 'this/application';
import { type CreateTodoRequest } from 'this/infrastructure';
import { Post, Get } from '@appr/http';

const factory = (application: Application) => ({
  createTodo: Post<CreateTodoRequest>()('/todos')((request, response) => {
    const { title } = request.body;
    application.createTodo({
      type: 'CreateTodo',
      title,
      key: '',
    });
    response.sendStatus(202);
  }),
  getTodos: Get()('/todos')((request, response) => {
    response.send(application.getAllTodos());
  }),
});

export default factory;
