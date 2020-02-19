import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react-web';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevForm from './components/DevForm';
import DevItem from './components/DevItem';
import pin from './assets/pin-on-map.json';
import location from './assets/location-map.json';

function App() {
    const [devs, setDevs] = useState([]);    

    useEffect(() => {
        async function loadDevs() {
            const response = await api.get('/devs');

            setDevs(response.data);
        }

        loadDevs();
    }, [devs]);    

    async function handleAddDev(data) {
        const response = await api.post('/devs', data);

        setDevs([...devs, response.data]);
    }
    
    return (        
        <div id="app">                    
            <aside>
                <strong>Cadastrar</strong>
                <DevForm onSubmit={handleAddDev} />
            </aside>

            <main>
                <ul>
                    {devs.map(dev => (
                        <DevItem key={dev._id} dev={dev} setDevs={setDevs} />
                    ))}
                </ul>
            </main>
            <Lottie options={{
                animationData: pin
            }} autoPlay loop autoSize resizeMode="contain" width="5%" />
            <Lottie options={{
                animationData: location
            }} autoPlay loop autoSize resizeMode="contain" width="5%" />
        </div>
    );
}

export default App;