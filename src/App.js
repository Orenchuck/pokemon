import React from 'react';
import axios from 'axios';
import { Col, Form, Button, Row, ListGroup } from 'react-bootstrap';
import './App.css';
import PokeModal from './PokeModal';
import Pagination from './Pagination';

const URL_API = 'https://pokeapi.co/api/v2/';

class App extends React.Component {
  state = {
    pokemons: [],
    isShowModal: false,
    currentPokemon: [],
    pages: null,
    currentPage: 0,
    limit: 20,
    countItems: null,
    searchName: '',
    pokemonTypes: null,
  }

componentDidMount() {
  axios.get(`${URL_API}pokemon`)
  .then(allpokemon => {
    this.setState({
      pages: Math.ceil(allpokemon.data.count / 20),
      countItems: allpokemon.data.count,
    });

    allpokemon.data.results.forEach(pokemon => {
     this.getPokemonData(pokemon); 
    })
   })
  .catch(err => console.log(err));

  axios.get(`${URL_API}type`)
  .then(res => {
    this.setState({
      pokemonTypes: res.data.results,
    })
  })
}

getPokemonData = pokemon => {
  const { pokemons } = this.state;
  let pokemonData;
  const url = pokemon.url;
  axios(url)
    .then(res => {
      pokemonData = res.data;
    })
    .then(() => {
      pokemons.push(pokemonData);
      this.setState({
      pokemons
      })
    })
    .catch(err => console.log(err))
}

showModal = pokemon => {
  const { isShowModal } = this.state;
  this.setState({
    isShowModal: !isShowModal,
    currentPokemon: pokemon,
  })
} 

changePageHandler = async page => {
  const { limit } = this.state;
  
  try {
    axios
      .get(`${URL_API}pokemon?offset=${--page * limit}&limit=${limit}`)
      .then(res => {
        this.setState({
          currentPage: page,
          pokemons: [],
        });
        res.data.results.forEach(pokemon => {
          this.getPokemonData(pokemon); 
         })
     
      })
      .catch(err => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

changeLimitHandler = e => {
  const { countItems } = this.state;
  const limit = e.target.value;
  this.setState({
    limit,
    currentPage: 0,
    pages: Math.ceil(countItems / limit),
  });
 setTimeout(() => this.changePageHandler(1), 100);
}

searchHandler = e => {
  this.setState({
    searchName: e.target.value,
  })
}

searchSubmit = () => {
  const { countItems, searchName } = this.state;
  if (searchName.length !== 0) {
    this.setState({
    pokemons: [],
  });

  axios.get(`${URL_API}pokemon?offset=0&limit=${countItems}`)
  .then(allpokemon => {
    allpokemon.data.results.forEach(res => {
      if (res.name.includes(searchName)) {
        this.getPokemonData(res); 
      }
    });
   })
  .catch(err => console.log(err));
  }
}

tagsHandle = type => {
  const { limit } = this.state;
  this.setState({
    pokemons: [],
  });

  axios
    .get(`${type.url}`)
    .then(res => {
      for (let i = 0; i < limit; i += 1) {
        this.getPokemonData(res.data.pokemon[i].pokemon);
      }
    })
    .catch(err => console.log(err));
}

render() {
  const { pokemons, isShowModal, currentPokemon, currentPage, pages, pokemonTypes } = this.state;
  
  return (
    <div>
      <Row>
        <Col xl={6} className="headPanel">
          <Form>
            <Form.Label>Find pokemon by name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" onChange={(e) => this.searchHandler(e)} />
            <br />
            <Button onClick={this.searchSubmit}>Find</Button>
          </Form>
          <br />
          <Form>
            <Form.Group>
              <Form.Label>To show on page</Form.Label>
              <Form.Control as='select' onChange={(e) => this.changeLimitHandler(e)}>
                <option>&nbsp;</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <ListGroup horizontal={'sm'}>
        {pokemonTypes && pokemonTypes.length !== 0 ? pokemonTypes.map(type => (
            <ListGroup.Item onClick={() => this.tagsHandle(type)}>{type.name}</ListGroup.Item>
        )) : null}
        </ListGroup>
      </Row>
      <Row className="pokemonArea">
      {pokemons && pokemons.length !== 0 ? 
        pokemons.map(pokemon => (
          <Col lg={2} md={4} sm={6} xs={12}>
          <div key={pokemon.id} onClick={() => this.showModal(pokemon)}>
            <h3>{pokemon.name}</h3>
            <img src={`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`} alt="" style={{width: "100px"}} />
            {pokemon.types.map(type => (
              <p key={type.type.name}>{type.type.name}</p>
            ))}
          </div>
          </Col>
        ))
          : null}
          </Row>
          {isShowModal ? <PokeModal show={isShowModal} onHide={this.showModal} pokemon={currentPokemon} /> : null}
          <Pagination page={currentPage} pageCount={pages} perPage={20} switchPage={this.changePageHandler} />
    </div>
  );
}
}

export default App;
