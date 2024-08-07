'use client';

import {
  createTodos,
  deleteTodosSoft,
  getTodos,
  updateTodos,
} from '@/actions/todos/todo.action';
import { Todo } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

const useTodos = (userId = '') => {
  const [isLoading, setIsLoading] = useState(false);
  const [todoList, setTodoList] = useState<Todo[]>();

  const onGetTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const resultTodos = await getTodos(userId);

      if (resultTodos) setTodoList(resultTodos);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    onGetTodos();
  }, [onGetTodos]);

  const onCreateEmptyTodos = async () => {
    await createTodos('');
    await onGetTodos();
  };

  const onUpdateTodos = async (id: number, task: string) => {
    await updateTodos(id, task);
    await onGetTodos();
  };

  const onDeleteTodos = async (id: number) => {
    await deleteTodosSoft(id);
    await onGetTodos();
  };

  return {
    todos: todoList,
    isLoading,
    onCreateEmptyTodos,
    onUpdateTodos,
    onDeleteTodos,
  };
};
export default useTodos;
