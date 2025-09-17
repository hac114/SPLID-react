import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = true 
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;