import React from 'react';
import { Button, Modal } from 'react-bootstrap';

export default ({ show, onHide, pokemon }: Props) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
        <Modal.Title>{pokemon.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div><b>base_experience </b> {pokemon.base_experience}</div>
        <div><b>forms </b> {pokemon.forms.map(form => (<span key={form.name}>{form.name}</span>))}</div>
        <div><b>moves </b> {pokemon.moves.map(move => (<Button variant="light" key={move.move.name}>{move.move.name}</Button>))}</div>
        <div><b>weight </b> {pokemon.weight}</div>
        <div><b>height </b> {pokemon.height}</div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Ok
      </Button>
    </Modal.Footer>
    </Modal>
  )