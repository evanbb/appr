interface Command<Key extends string, Type extends string, Version = 1> {
  key: Key;
  type: Type;
}

interface TodoCommand<Subject extends string, Version = 1>
  extends Command<string, Subject, Version> {}

export interface CreateTodo extends TodoCommand<'CreateTodo'> {
  title: string;
}

export interface ChangeTitle extends TodoCommand<'ChangeTitle'> {
  newTitle: string;
}

export interface MarkWhetherDone extends TodoCommand<'MarkWhetherDone'> {
  done: boolean;
}

export type COMMAND_TYPES = CreateTodo | ChangeTitle | MarkWhetherDone
