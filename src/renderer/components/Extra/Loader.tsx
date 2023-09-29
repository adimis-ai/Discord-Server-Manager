import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="lds-ripple">
      <div>
        </div>
      <div>
      </div>
    </div>
  );
};

export default Loader;
