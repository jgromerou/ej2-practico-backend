import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ListaTareas from './ListaTareas';
import {
  obtenerListaTareas,
  consultaAgregarTarea,
  consultaTarea,
  consultaBorrarTarea,
} from './helpers/queries';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const FormularioTarea = () => {
  const [listaTareas, setListaTareas] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    obtenerListaTareas().then((respuesta) => {
      setListaTareas(respuesta);
    });
  }, []);

  const onSubmit = (datos) => {
    console.log('tarea', datos);
    consultaAgregarTarea(datos).then((respuestaCreado) => {
      if (respuestaCreado && respuestaCreado.status === 201) {
        Swal.fire(
          'Receta creada',
          `La tarea ${datos.nombreTarea} fue creada correctamente`,
          'success'
        );
        //actualizar la lista de tareas
        obtenerListaTareas().then((respuesta) => setListaTareas(respuesta));
        reset();
      } else {
        Swal.fire(
          'Ocurrio un error',
          `La tarea ${datos.inputTarea} no fue creada, intentelo mas tarde`,
          'error'
        );
      }
    });
  };

  //borrar todas las tareas del json-server
  const borrarlistaTareas = () => {
    Swal.fire({
      title: `¿Estás seguro de borrar toda la lista de tareas?`,
      text: 'No se puede revertir este paso',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        //borrar la lista de tareas de la API
        listaTareas.filter((tarea) =>
          consultaBorrarTarea(tarea.id).then((respuesta) => {
            if (respuesta) {
              console.log(respuesta);
              Swal.fire(
                'Lista de Tareas eliminada',
                `la lista completa fue eliminada correctamente`,
                'success'
              );
              obtenerListaTareas().then((respuesta) => {
                setListaTareas(respuesta);
              });
            } else {
              Swal.fire(
                'Ocurrio un error',
                `No se puede borrar la tarea, intentelo mas tarde`,
                'error'
              );
            }
          })
        );
      }
    });
  };

  return (
    <section>
      <Row>
        <Col className="d-flex justify-content-end">
          <Button
            className="my-3"
            variant="danger"
            onClick={() => borrarlistaTareas()}
          >
            Borrar Lista de Tareas
          </Button>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-2">
          <Form.Control
            className="col-sm-9"
            type="text"
            placeholder="Ingrese una nueva tarea"
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

        <Button
          className="col-12 col-sm-2 btn-lg btn-block mb-2"
          variant="success"
          type="submit"
        >
          Enviar
        </Button>
      </Form>
      <ListaTareas
        listaTareas={listaTareas}
        setListaTareas={setListaTareas}
      ></ListaTareas>
    </section>
  );
};

export default FormularioTarea;
