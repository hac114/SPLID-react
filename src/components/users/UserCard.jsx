import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <div className="user-header">
        <h3>{user.name}</h3>
        <div className="user-actions">
          <button onClick={() => onEdit(user)} className="edit-btn">
            ✏️
          </button>
          <button onClick={() => onDelete(user.id)} className="delete-btn">
            🗑️
          </button>
        </div>
      </div>

      <div className="user-details">
        {user.email && (
          <div className="user-info">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
        )}
        
        {user.phone && (
          <div className="user-info">
            <span className="info-label">Telefono:</span>
            <span className="info-value">{user.phone}</span>
          </div>
        )}

        <div className="user-stats">
          <div className="stat">
            <span className="stat-label">Gruppi</span>
            <span className="stat-value">{user.groups?.length || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Speso</span>
            <span className="stat-value">€{user.totalSpent?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Dovuto</span>
            <span className="stat-value">€{user.totalOwed?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      <div className="user-footer">
        <span className="join-date">
          Unitò il {new Date(user.joinDate).toLocaleDateString('it-IT')}
        </span>
      </div>
    </div>
  );
};

export default UserCard;