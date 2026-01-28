import { Link } from 'react-router';

export function HomeView() {
  return (
    <div>
      <h1>Living Dex Tracker</h1>
      <p>Track your progress towards completing a Living Pokédex.</p>
      <nav>
        <Link to="/dex">View Games</Link>
      </nav>
    </div>
  );
}
