import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Home() {
  const [value, setValue] = useLocalStorage<number>('test', {
    defaultValue: 0,
  });
  useEffect(() => {
    setValue((prev) => prev + 1);
  }, []);
  return <div>{value}</div>;
}
