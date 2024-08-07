'use client';

import { CheckIcon } from '@/components/icons/check-icon';
import { CrossIcon } from '@/components/icons/cross-icon';
import { FilterIcon } from '@/components/icons/filter-icon';
import { GithubIcon } from '@/components/icons/github-icon';
import { GoogleIcon } from '@/components/icons/google-icon';
import { ListIcon } from '@/components/icons/list-icon';
import { PlusIcon } from '@/components/icons/plus-icon';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useTodos from '@/hooks/useTodos';
import useUser from '@/hooks/useUser';
import { supabase } from '@/lib/supabase/client';
import TodoCard from './components/TodoCard';

const TodoApp = () => {
  const { user, error, isLoading } = useUser();
  const {
    todos,
    onCreateEmptyTodos,
    onUpdateTodos,
    onUpdateTodoIsCompleted,
    onDeleteTodos,
    isLoading: isTodosLoading,
  } = useTodos(user ? user.id : '');

  if (isLoading || isTodosLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load user data</div>;
  }

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_TODO_AUTH_REDIRECT_TO,
      },
    });
    if (error) console.error('Error logging in with OAuth:', error);
  };

  const handleOAuthLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error log out:', error);
    window.location.reload();
  };

  return (
    <div className="flex-1 py-8">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Todo App</h1>
              {user && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onCreateEmptyTodos(user.id)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Todo
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">Filter by:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <CrossIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {todos?.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    isTextMode={todo.task.length > 0 ? true : false}
                    onChangeCheck={onUpdateTodoIsCompleted}
                    onClickSendTask={onUpdateTodos}
                    onClickDelete={onDeleteTodos}
                  />
                ))}
              </div>
            </div>
          </div>
          {user && user.email ? (
            <Button
              onClick={handleOAuthLogout}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Sign out
            </Button>
          ) : (
            <div className="space-y-6">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleOAuthLogin('google')}
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </Button>
                  <Button
                    onClick={() => handleOAuthLogin('github')}
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Sign in with GitHub
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TodoApp;
