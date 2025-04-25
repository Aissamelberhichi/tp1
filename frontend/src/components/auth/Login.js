import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await authService.login(formData);
      login(res.user, res.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Connexion</h1>
      <form className="form" onSubmit={onSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Connexion" />
      </form>
      <p className="text-center">
        Vous n'avez pas de compte? <Link to="/register">S'inscrire</Link>
      </p>
    </div>
  );
};

export default Login;
