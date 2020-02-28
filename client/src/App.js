import React, { Component } from 'react';
import axios from 'axios';


class App extends Component {
    state = {
        data: [],
        id: 0,
        message: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
    };

    componentDidMount() {
        this.getDataFromDb();
        if (!this.state.intervalIsSet) {
            let interval = setInterval(this.getDataFromDb, 1000);
            this.setState({intervalIsSet: interval});
        }
    }

    componentWillUnmount() {
       if (this.state.intervalIsSet) {
           clearInterval(this.state.intervalIsSet);
           this.setState({intervalIsSet: false});
       }
    }

    getDataFromDb() {
        fetch('http://localhost:3001/api/getData')
            .then((data) => data.json())
            .then((res) => this.setState({data: res.data}) )
    }
    
    putDataToDb() = (message) => {
        let ids = this.state.data.map((data) => data.id);
        let idToBeAdded = 0;
        while (ids.includes(idToBeAdded)) {
            ++idToBeAdded;
        }

        axios.post('http://localhost:3001/api/putData', { 
            id: idToBeAdded,
            message: message
        });
    }

    deleteFromDb() = (idToDelete) => {
        parseToInt(idToDelete);
        let objIdToDelete = null;

        this.state.data.forEach((dat) => {
            if (dat.id == idToDelete) return dat._id
        });
        
        axios.delete('http://localhost:3001/api/deleteData', {
            id: objIdToDelete
        })

    } 

	render() {
		return <div>i am happy to use react backend!</div>;
	}
}
export default App;
