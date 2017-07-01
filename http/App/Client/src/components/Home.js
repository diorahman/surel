import { h } from 'preact'
import { route } from 'preact-router'
import Composer from './Composer'

function search(query) {
  route(`/email/${encodeURIComponent(query)}`);
}

export default function Home() {
  return (
    <section>
      <p>Enter an email receipt ID</p>
      <input type="search"
             placeholder="e.g. 9b6ffe80-c65f-4cb1-b9dc-8dd487e61c07"
             onSearch={e => search(e.target.value)}
             />
      <Composer />
    </section>
  );
}
