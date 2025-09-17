import Card from '../common/Card';
import './UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Card className="user-card" hoverable={true}>
      <div className="card-header">
        <h3 className="card-title">{user.name}</h3>
        <div className="card-actions">
          <button onClick={() => onEdit(user)} className="edit-btn" title="Modifica">
            ✏️
          </button>
          <button onClick={() => onDelete(user.id)} className="delete-btn" title="Elimina">
            🗑️
          </button>
        </div>
      </div>

      <div className="card-body">
        {user.email && (
          <div className="user-info">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
        )}
        
        {user.phone && (
          <div className="user-info">
            <span className="info-label">Tel:</span>
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

      <div className="card-footer">
        <span className="join-date">
          Unito il {new Date(user.joinDate).toLocaleDateString('it-IT')}
        </span>
      </div>
    </Card>
  );
};

export default UserCard;