import React from 'react';
import Swal from 'sweetalert2';
import Delete from '@material-ui/icons/Delete';
import './styles.css';
import api from '../../services/api';

export default function DevItem({ dev }) {       

  async function handleDelete(event, id) {       
    event.preventDefault();

    Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, apague!',
    }).then(result => {
      if (result.value) {     
        api.delete(`/dev/${id}`);
      }
    });
  }

  return (
    <>
      <li className="dev-item">
      <header>
        <div className="user-info">              
        <img src={dev.avatar_url} alt={dev.name} />
          <div className="info-name">
            <strong>{dev.name}</strong>        
            <span>{dev.techs.join(', ')}</span>                       
          </div>
        </div>
        <a href="/" onClick={(event) => handleDelete(event, dev._id)}>
            <Delete variant="contained" color="primary" />
          </a>
      </header>
      <p>{dev.bio}</p>
      <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
    </li> 
  </>
  );
}