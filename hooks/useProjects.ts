'use client';

import { Project } from '@/types/types';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<Project[]>);

const useProjects = () => {
  const { data: projects, error, isLoading } = useSWR('/api/projects', fetcher);
  return {
    projects,
    error,
    isLoading,
  };
};
export default useProjects;
