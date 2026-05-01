import Link from 'next/link';
import CarSVG from './CarSVG';

export default function CarCard({ car }) {
  return (
    <Link href={`/cars/${car.id}`} className="car-card">
      <div className="car-img">
        {car.tag && <div className="car-badge">{car.tag}</div>}
        {car.image_url ? (
          <img src={car.image_url} alt={car.name} />
        ) : (
          <CarSVG id={car.id} />
        )}
        <div className="car-img-overlay" />
      </div>
      <div className="car-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div className="car-name">{car.name}</div>
          <div className="car-rating">
            <span className="stars">★</span> {car.rating}
            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}> ({car.reviews})</span>
          </div>
        </div>
        <div className="car-desc">{car.description?.substring(0, 72)}...</div>
        <div className="car-specs">
          <div className="car-spec"><span className="car-spec-icon">⚡</span>{car.specs?.power}</div>
          <div className="car-spec"><span className="car-spec-icon">🪑</span>{car.specs?.seats} places</div>
          <div className="car-spec"><span className="car-spec-icon">⛽</span>{car.specs?.fuel}</div>
        </div>
        <div className="car-footer">
          <div>
            <div className="car-price-label">Prix / jour</div>
            <div className="car-price">
              {Number(car.price_per_day).toLocaleString('fr-DZ')} <span>DZD</span>
            </div>
          </div>
          <span className="btn-sm">Voir →</span>
        </div>
      </div>
    </Link>
  );
}
