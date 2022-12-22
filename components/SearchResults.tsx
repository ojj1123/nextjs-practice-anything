// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

import { Product, fetchData } from '../utils/data';

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

interface Props {
  query: string;
}
/**
 * useDeferredValue 관련 문서 링크
 * @see https://beta.reactjs.org/apis/react/useDeferredValue
 * @see https://reactjs.org/blog/2022/03/29/react-v18.html#new-feature-transitions
 * @see https://yrnana.dev/post/2022-04-12-react-18#suspense%EC%99%80-transition
 */
export default function SearchResults({ query }: Props) {
  if (query === '') {
    return null;
  }
  const results: Product[] = use(
    fetchData(`/search?q=${query}`) as Promise<Product[]>
  );
  if (results.length === 0) {
    return (
      <p>
        No matches for <i>{query}</i>
      </p>
    );
  }
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise: Promise<Product[]>) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      (result) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
    throw promise;
  }
}
