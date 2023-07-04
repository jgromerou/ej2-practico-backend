import { ListGroup } from 'react-bootstrap';
import ItemTarea from './ItemTarea';
const ListaTareas = ({ listaTareas, setListaTareas }) => {
  return (
    <ListGroup id="listgroup">
      {listaTareas.map((tarea) => (
        <ItemTarea
          key={tarea.id}
          tarea={tarea}
          setListaTareas={setListaTareas}
        ></ItemTarea>
      ))}
    </ListGroup>
  );
};

export default ListaTareas;
