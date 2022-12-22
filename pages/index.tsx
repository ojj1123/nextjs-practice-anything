import { Suspense, useDeferredValue, useState } from 'react';
import SearchResults from '../components/SearchResults';

export default function Home() {
  const [query, setQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}
