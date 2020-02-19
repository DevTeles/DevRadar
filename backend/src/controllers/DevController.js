const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body; 

    let dev = await Dev.findOne({ github_username });    

    if (!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`);

      const { name = login, avatar_url, bio } = response.data;      
  
      const techsArray = parseStringAsArray(techs);
  
      const location ={
        type: 'Point',
        coordinates: [longitude, latitude],
      };
  
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })  
      
      // Filtrar as conexões que estão há no máximo 10km de distância
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas.

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }   
    return res.json(dev); 
  },

  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async update(req, res) {     

    const { github_username, latitude, longitude, techs } = req.body;
    const { id } = req.params;

    const techsArray = parseStringAsArray(techs);  
    const location ={
      type: 'Point',
      coordinates: [longitude, latitude],
    };
    
    await Dev.findOneAndUpdate(
      id,
      {
        github_username,
        techs: techsArray,
        location
      },      
      (err, doc) => {
        if (err) {          
          return res.status(404).json({ error: 'User already not exist' });
        }
      return res.json(doc);
    });     
  },

  async delete(req, res) {
    const { id } = req.params;
    
    try {      
      const dev = await Dev.findById(id);      
      
      if (!dev) {
        return res.status(404).json({ error: 'Dev not found.' });
      }

      await Dev.deleteOne({ _id: id });    

      return res.status(200).json({ sucess: 'Deleted with sucess.' });
    } catch (err) {
      return res.status(400).json({ erro: 'Delete failed.' });
    }
  }
}