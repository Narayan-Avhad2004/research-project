import "../styles/components/stat-card.css";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  type = "default",
}) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-content">

        <div className="stat-card-info">
          <span className="stat-card-title">
            {title}
          </span>

          <h2 className="stat-card-value">
            {value}
          </h2>

          <span className="stat-card-subtitle">
            {subtitle}
          </span>
        </div>

        <div className="stat-card-icon">
          {icon}
        </div>

      </div>
    </div>
  );
};

export default StatCard;