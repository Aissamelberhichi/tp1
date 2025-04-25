import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/api';

const Register = ({ login }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');

  const { username, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      const res = await authService.register({
        username,
        email,
        password
      });
      
      login(res.user, res.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Inscription</h1>
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
            type="email"
            placeholder="Adresse email"
            name="email"
            value={email}
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="S'inscrire" />
      </form>
      <p className="text-center">
        Vous avez déjà un compte? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default Register;
