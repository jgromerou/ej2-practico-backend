import { Button, ListGroup, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {
  consultaBorrarTarea,
  consultaEditarTarea,
  consultaTarea,
  obtenerListaTareas,
} from './helpers/queries';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ItemTarea = ({ tarea, setListaTareas }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const [show, setShow] = useState(false);
  const [tareaId, setTareaId] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (tarea) => {
    consultaTarea(tarea.id).then((respuesta) => {
      if (respuesta) {
        console.log('tengo que cargar el objeto en el formulario');
        console.log(respuesta);
        setValue('nombreTarea', respuesta.nombreTarea);
        setShow(true);
        setTareaId(tarea.id);
      } else {
        Swal.fire(
          'Ocurrio un error',
          `No se puede editar la tarea, intentelo mas tarde`,
          'error'
        );
      }
    });
  };

  const onSubmit = (tarea) => {
    console.log(tarea);
    consultaEditarTarea(tarea, tareaId).then((respuestaEditado) => {
      console.log(respuestaEditado);
      if (respuestaEditado && respuestaEditado.status === 200) {
        Swal.fire(
          'Tarea editada',
          `La tarea ${tarea.nombreTarea} fue editada correctamente`,
          'success'
        );
        //actualizar la lista de tareas.
        obtenerListaTareas().then((respuesta) => {
          setListaTareas(respuesta);
        });
      } else {
        Swal.fire(
          'Ocurrio un error',
          `La tarea ${tarea.nombreTarea} no fue editada, intentelo mas tarde`,
          'error'
        );
      }
    });

    handleClose();
  };

  const borrarTarea = () => {
    Swal.fire({
      title: `¿Estás seguro de borrar la tarea ${tarea.nombreTarea}?`,
      text: 'No se puede revertir este paso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        //borrar la tarea de la API
        consultaBorrarTarea(tarea.id).then((respuesta) => {
          console.log(respuesta);
          if (respuesta && respuesta.status === 200) {
            Swal.fire(
              'Tarea eliminada',
              `la tarea ${tarea.nombreTarea} fue eliminada correctamente`,
              'success'
            );
            //actualizar la lista de tareas.
            obtenerListaTareas().then((respuesta) => {
              setListaTareas(respuesta);
            });
          } else {
            Swal.fire(
              'Ocurrió un error',
              `Intente realizar esta operación nuevamente más tarde`,
              'error'
            );
          }
        });
      }
    });
  };
  return (
    <div>
      <ListGroup.Item className="d-flex justify-content-between">
        {tarea.nombreTarea}
        <div>
          <Button variant="warning me-1" onClick={() => handleShow(tarea)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => borrarTarea(tarea)}>
            Borrar
          </Button>
        </div>
      </ListGroup.Item>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-2">
              <Form.Control
                className="col-sm-9"
                type="text"
                placeholder="Editar tarea"
                {...register('nombreTarea', {
                  required: 'El Nombre de la Tarea es un dato obligatorio.',
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: 'Por favor, ingrese solo letras y espacios.',
                  },
                })}
              />
              <Form.Text className="text-danger my-2 py-3">
                {errors.nombreTarea?.message}
              </Form.Text>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Enviar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ItemTarea;
